YUI.add('decrypt-view', function (Y) {

    'use strict';

    Y.DecryptView = Y.Base.create('decryptView', Y.View, [], {

        _fileDropper: null,
        _canvasHelper: new Y.CanvasHelper(),

        _handleFileDropped: function (e) {
            var originalContext = this.get('container').one('#original canvas').invoke('getContext', '2d'),
                extractedCanvas,
                extractedContext,
                originalImg = new Image(),
                combiner = new Y.Combiner(),
                extractedImageData,
                inst = this,
                generalInfo,
                hiddenText,
                extractedNode;

            // show encrypted image and extract the hidden image
            originalImg.onload = function () {
                originalContext.drawImage(originalImg, 0, 0, 300, 300);

                generalInfo = combiner.extractGeneralInformation(originalContext.getImageData(0, 0, 300, 300));

                if (generalInfo.type === combiner.CONTENT_TYPE_TEXT) {
                    hiddenText = combiner.extractText(originalContext.getImageData(0, 0, 300, 300), parseInt(generalInfo.contentLength, 2));
                    extractedNode = Y.one('#extracted_text');

                    // add extracted text to DOM
                    extractedNode.one('.result').set('text', hiddenText);
                } else if (generalInfo.type === combiner.CONTENT_TYPE_IMAGE) {
                    extractedNode = Y.one('#extracted_image');
                    extractedCanvas = extractedNode.one('canvas');
                    extractedContext = extractedCanvas.invoke('getContext', '2d');

                    // add extracted image to DOM
                    extractedImageData = combiner.extract(originalContext.getImageData(0, 0, 300, 300), 255);
                    extractedContext.putImageData(extractedImageData, 0, 0);
                    inst._canvasHelper.replaceCanvasByImage(extractedCanvas);
                } else {
                    // add error info to DOM
                    extractedNode = Y.one('#extracted_text');
                    extractedNode.one('.result').set('text', 'Error: unknown content type');
                }

                extractedNode.removeClass('hidden');

            }

            originalImg.src = e.src;

            // remove filedropper and show result
            this._fileDropper.destroy();
            this.get('container').one('#resultbox').removeClass('hidden');
        },

        initUI: function () {

            // init fileDropper
            this._fileDropper = new Y.FileDropper({
                srcNode: '#dropbox'
            });

            Y.once('filedropper:drop', this._handleFileDropped, this);

            this._fileDropper.render();
        },

        render: function () {
            var html = Y.one('#template_decrypt').getContent(),
                inst = this;

            this.get('container').setHTML(html);

            setTimeout(function () {
                inst.initUI();
            }, 100)// TODO: is there no event or callback for set html?
        }

    });

}, '0.1', {requires: ['view', 'event-custom', 'combiner', 'canvas-helper']});
