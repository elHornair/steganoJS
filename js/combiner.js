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

        // maps an 8-bit value to a 1-bit value
        mapToOneBit: function (oriVal) {
            return (oriVal >= 128) ? 1 : 0;
        },

        // returns the last bit of an integer
        getLastBit: function (myInt) {
            var bitString = myInt.toString(2);
            return parseInt(bitString.charAt(bitString.length-1), 2);
        },

        _stringToBinary: function (sourceString) {
            var i = 0,
                n = sourceString.length,
                currentCharBits,
                fillString = '00000000',
                resultBitString = '';

            for (i = 0; i < n; i+=1) {
                currentCharBits = fillString + sourceString.charCodeAt(i).toString(2);// if the char code doesn't take a full byte, we fill it with zeros
                resultBitString += currentCharBits.substr(-8);
            }

            return resultBitString;
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
            var containerPixels = containerData.data,
                minifiedPixels = this.minify(sourceData, 1).data,
                n = minifiedPixels.length,
                i;

            for (i = 0; i < n; i += 4) {
                containerPixels[i  ] = ((containerPixels[i  ] >> 1) << 1) | minifiedPixels[i  ];
                containerPixels[i+1] = ((containerPixels[i+1] >> 1) << 1) | minifiedPixels[i+1];
                containerPixels[i+2] = ((containerPixels[i+2] >> 1) << 1) | minifiedPixels[i+2];
            }

            return containerData;
        },

        // hides text in an image
        hideText: function (containerData, textToHide) {
            var containerPixels = containerData.data,
                bitStringToHide = this._stringToBinary(textToHide),
                n = Math.ceil((bitStringToHide.length/3) * 4),
                i,
                sourceIndex;

            for (i = 0; i < n; i += 4) {
                sourceIndex = (i/4) * 3;

                containerPixels[i  ] = ((containerPixels[i  ] >> 1) << 1) | parseInt(bitStringToHide.charAt(sourceIndex  ));
                containerPixels[i+1] = ((containerPixels[i+1] >> 1) << 1) | parseInt(bitStringToHide.charAt(sourceIndex+1));
                containerPixels[i+2] = ((containerPixels[i+2] >> 1) << 1) | parseInt(bitStringToHide.charAt(sourceIndex+2));
            }

            return containerData;
        },

        // extracts text from image
        extractText: function (sourceData) {
            var sourcePixels = sourceData.data,
                n = sourcePixels.length,// TODO: this information should be taken from some information field in the image (use alpha chanel?)
                i,
                hiddenBitString = '';

            for (i = 0; i < n; i += 4) {
                hiddenBitString += this.getLastBit(sourcePixels[i  ]);
                hiddenBitString += this.getLastBit(sourcePixels[i+1]);
                hiddenBitString += this.getLastBit(sourcePixels[i+2]);
            }

            return this._binaryToString(hiddenBitString);
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
