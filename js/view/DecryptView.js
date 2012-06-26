YUI.add('decrypt-view', function (Y) {

    'use strict';

    Y.DecryptView = Y.Base.create('decryptView', Y.View, [], {

        _fileDropper: null,

        // TODO: move this to a helper and share it
        replaceCanvasByImage: function (canvasElement) {
            var imgData = canvasElement.invoke('toDataURL', 'image/png');
            canvasElement.replace('<img src="' + imgData + '" class="thumbnail"/>');
        },

        _handleFileDropped: function (e) {
            var originalContext = this.get('container').one('#original canvas').invoke('getContext', '2d'),
                extractedCanvas = this.get('container').one('#extracted canvas'),
                extractedContext = extractedCanvas.invoke('getContext', '2d'),
                originalImg = new Image(),
                combiner = new Y.Combiner(),
                extractedImageData,
                inst = this;

            // show encrypted image and extract the hidden image
            originalImg.onload = function () {
                originalContext.drawImage(originalImg, 0, 0, 300, 300);

                extractedImageData = combiner.extract(originalContext.getImageData(0, 0, 300, 300), 255);
                extractedContext.putImageData(extractedImageData, 0, 0);

                inst.replaceCanvasByImage(encryptedCanvas);
            }

            originalImg.src = e.src;

            // remove filedropper and show result
            Y.detach('filedropper:drop', this._handleFileDropped, this);
            this._fileDropper.destroy();
            this.get('container').one('#resultbox').removeClass('hidden');
        },

        initUI: function () {

            // init fileDropper
            this._fileDropper = new Y.FileDropper({
                srcNode: '#dropbox'
            });

            Y.on('filedropper:drop', this._handleFileDropped, this);

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

}, '0.1', {requires: ['view', 'combiner', 'event-custom']});
