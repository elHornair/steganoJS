YUI.add('combiner', function (Y) {

    'use strict';

    function Combiner(config) {
        Combiner.superclass.constructor.apply(this, arguments);
    }

    Combiner.NAME = "combiner";

    Combiner.ATTRS = {
    }

    // TODO: make amount of used bits for hiding variable

    Y.extend(Combiner, Y.Base, {

        CURRENT_VERSION:     '00000001',
        CONTENT_TYPE_NONE:   '00000000',
        CONTENT_TYPE_TEXT:   '00000001',
        CONTENT_TYPE_IMAGE:  '00000010',
        TEXT_FILLER:  '---------------',

        // maps an 8-bit value to a 1-bit value
        mapToOneBit: function (oriVal) {
            return (oriVal >= 128) ? 1 : 0;
        },

        // returns the last bit of an integer
        getLastBit: function (myInt) {
            var bitString = myInt.toString(2);
            return parseInt(bitString.charAt(bitString.length-1), 2);
        },

        _binaryToString: function (sourceBitString) {
            var i = 0,
                n = parseInt(sourceBitString.length / 8, 10),
                resultString = '';

            for (i = 0; i < n; i+=1) {
                resultString += String.fromCharCode(parseInt(sourceBitString.substr(i*8, 8), 2));
            }

            return resultString;
        },

        // adds general information about the hidden data
        _addGeneralInformation: function (containerData, type, contentLength) {
            var containerPixels = containerData.data,
                n,
                i,
                contentLength = contentLength || 0,
                infoBitString = '';

            // add version
            infoBitString += this.CURRENT_VERSION;

            // add type
            infoBitString += type;

            // add content length
            infoBitString += ('000000000000000000000000' + contentLength.toString(2)).substr(-24);// we normalize the length to take three bytes

            // hide general information in the alpha channel
            n = 4 * infoBitString.length;

            for (i = 0; i < n; i += 4) {
                containerPixels[i+3] = ((containerPixels[i+3] >> 1) << 1) | parseInt(infoBitString.charAt(i/4));// TODO: this seems to mess up the hidden text
            }

            return containerData;
        },

        // extracts general information about the hidden data
        extractGeneralInformation: function (containerData) {
            var containerPixels = containerData.data,
                n = (1 + 1 + 3) * 8,// in version 1, this is the length of the general information in bits
                i,
                infoBitString = '',
                containerData = {};

            // extract general info bits
            for (i = 0; i < 4*n; i += 4) {
                infoBitString += this.getLastBit(containerPixels[i+3]);
            }

            // determine version
            containerData.version = infoBitString.substr(0, 8);

            // determine type
            containerData.type = infoBitString.substr(8, 8);

            // determine content length
            containerData.contentLength = infoBitString.substr(18, 32);

            return containerData;

        },

        // minifies an image so each pixel only needs 4 bit
        minify: function (sourceData, multiplier) {
            var originalData = sourceData.data,
                n = originalData.length,
                i;

            // loop through original data and minify it
            for (i = 0; i < n; i += 4) {
                originalData[i  ] = this.mapToOneBit(originalData[i  ]) * multiplier;// red
                originalData[i+1] = this.mapToOneBit(originalData[i+1]) * multiplier;// green
                originalData[i+2] = this.mapToOneBit(originalData[i+2]) * multiplier;// blue
            }

            return sourceData;
        },

        // combines two images by hiding the second in the first
        combine: function (containerData, sourceData) {
            // TODO: refactor (rename properly, add general information)
            var containerPixels = containerData.data,
                minifiedPixels = this.minify(sourceData, 1).data,
                n = minifiedPixels.length,
                i;

            for (i = 0; i < n; i += 4) {
                containerPixels[i  ] = ((containerPixels[i  ] >> 1) << 1) | minifiedPixels[i  ];
                containerPixels[i+1] = ((containerPixels[i+1] >> 1) << 1) | minifiedPixels[i+1];
                containerPixels[i+2] = ((containerPixels[i+2] >> 1) << 1) | minifiedPixels[i+2];
            }

            // add general information
            this._addGeneralInformation(containerData, this.CONTENT_TYPE_IMAGE);

            return containerData;
        },

        // hides text in an image
        hideText: function (containerData, textToHide, callback) {
            var usedBitsCounter = 0,
                workersFinished = 0,
                numWorkers = 1,
                textToHide = this.TEXT_FILLER + textToHide,// TODO: review all those properties. could something be simplified?
                partLength = Math.floor(textToHide.length / (numWorkers * 24)) * 24,
                offsetPerPart = ((partLength * 8) / 3) * 4,
                workerContainers = [],
                myWorker,
                i,
                inst = this,

                handleWorkerFinished = function (e) {
                    var combinedData;

                    workersFinished += 1;
                    usedBitsCounter += e.data.usedBits;

                    if (workersFinished >= numWorkers) {
                        combinedData = workerContainers[0].calculatedData;

                        // concatenate data from the different workers
                        for (i = 1; i < numWorkers; i++) {
                            combinedData.data.set(workerContainers[i].calculatedData.data.subarray(offsetPerPart*i), offsetPerPart*i);
                        }

                        // add general information
                        inst._addGeneralInformation(combinedData, inst.CONTENT_TYPE_TEXT, usedBitsCounter);

                        // return image data with hidden text
                        callback(combinedData);// TODO: throw an event instead
                    }
                };

            Y.log('amount of workers in use: ' + (numWorkers));

            for (i = 0; i < numWorkers; i++) {
                myWorker = new Worker('js/combinerWorker.js');
                myWorker.index = i;

                myWorker.addEventListener('message', function(e) {
                    workerContainers[e.data.index].calculatedData = e.data.containerData;
                    workerContainers[e.data.index].worker.terminate();
                    handleWorkerFinished(e);
                }, false);

                myWorker.postMessage({
                    index: i,
                    containerData: containerData,
                    textToHide: (i + 1 === numWorkers ?
                                 textToHide.substr(i*partLength) :// the last worker gets all the remaining text
                                 textToHide.substr(i*partLength, partLength)),
                    offset: i * offsetPerPart
                });

                workerContainers.push({
                    worker: myWorker,
                    data: null
                });

            }

        },

        // extracts text from image
        // textLength: lenght of the text in bits
        extractText: function (sourceData, textLength) {
            var sourcePixels = sourceData.data,
                n = (textLength*4) / 3,
                i,
                hiddenBitString = '';

            for (i = 0; i < n; i += 4) {
                hiddenBitString += this.getLastBit(sourcePixels[i  ]);
                hiddenBitString += this.getLastBit(sourcePixels[i+1]);
                hiddenBitString += this.getLastBit(sourcePixels[i+2]);
            }

            return this._binaryToString(hiddenBitString).substr(15);// TODO: do filling in a more proper way
        },

        // extracts an image hidden in the LSBs of an image
        extract: function (sourceData) {
            var sourcePixels = sourceData.data,
                n = sourcePixels.length,
                i;

            for (i = 0; i < n; i += 4) {
                sourcePixels[i  ] = this.getLastBit(sourcePixels[i  ]) * 255;
                sourcePixels[i+1] = this.getLastBit(sourcePixels[i+1]) * 255;
                sourcePixels[i+2] = this.getLastBit(sourcePixels[i+2]) * 255;
            }

            return sourceData;
        }

    });

    Y.Combiner = Combiner;

}, '0.1', {requires: ['base']});
