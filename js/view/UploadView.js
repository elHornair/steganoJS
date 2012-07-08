YUI.add('upload-view', function (Y) {

    'use strict';

    Y.UploadView = Y.Base.create('uploadView', Y.View, [], {

        _containerImgSrc: 'img/lena.png',
        _fileDropper: null,
        _canvasHelper: new Y.CanvasHelper(),

        replaceCanvasByImage: function (canvasElement) {
            var imgData = canvasElement.invoke('toDataURL', 'image/png');
            canvasElement.replace('<img src="' + imgData + '" class="thumbnail"/>');
        },

        _handleFileDropped: function (e) {
            var containerContext = this.get('container').one('#container canvas').invoke('getContext', '2d'),
                originalContext = this.get('container').one('#original canvas').invoke('getContext', '2d'),
                encryptedCanvas = this.get('container').one('#encrypted canvas'),
                encryptedContext = encryptedCanvas.invoke('getContext', '2d'),
                minifiedImageData,
                combinedImageData,
                originalImg = new Image(),
                combiner = new Y.Combiner(),
                inst = this;

            // minify uploaded image and hide it in container
            originalImg.onload = function () {
                originalContext.drawImage(originalImg, 0, 0, 300, 300);

                minifiedImageData = combiner.minify(originalContext.getImageData(0, 0, 300, 300), 255);// TODO: could we directly pass it the image?
                originalContext.putImageData(minifiedImageData, 0, 0);

                combinedImageData = combiner.combine(containerContext.getImageData(0, 0, 300, 300), originalContext.getImageData(0, 0, 300, 300));
                encryptedContext.putImageData(combinedImageData, 0, 0);

                inst._canvasHelper.replaceCanvasByImage(encryptedCanvas);
            }

            originalImg.src = e.src;

            // remove filedropper and show result
            this._fileDropper.destroy();
            this.get('container').one('#resultbox').removeClass('hidden');
        },

        initUI: function () {
            var containerContext = this.get('container').one('#container canvas').invoke('getContext', '2d'),
                containerImg = new Image();

            // init fileDropper
            this._fileDropper = new Y.FileDropper({
                srcNode: '#dropbox'
            });

            Y.once('filedropper:drop', this._handleFileDropped, this);

            this._fileDropper.render();

            // draw container image
            containerImg.onload = function() {
                containerContext.drawImage(containerImg, 0, 0, 300, 300);
            }
            containerImg.src = this._containerImgSrc;
        },

        render: function () {
            var html = Y.one('#template_upload').getContent(),
                inst = this;

            this.get('container').setHTML(html);

            setTimeout(function () {
                inst.initUI();
            }, 100)// TODO: is there no event or callback for set html?
        }

    });

}, '0.1', {requires: ['view', 'combiner', 'event-custom', 'canvas-helper']});
