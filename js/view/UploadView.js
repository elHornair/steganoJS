YUI.add('upload-view', function (Y) {

    'use strict';

    Y.UploadView = Y.Base.create('uploadView', Y.View, [], {

        _containerImgSrc: 'img/lena.png',

        _handleFileDrop: function (e, inst) {
            var files = e._event.dataTransfer.files,
                file,
                reader,
                inst = this;

            e.preventDefault();

            // return if we didn't get a file
            if (files.length <= 0) {
                return;
            }

            file = files[0];
            reader = new FileReader();

            // init the reader event handlers
            reader.onload = function (e) {
                inst.detach('drop', this._handleFileDrop, this);
                inst.processUploadedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        },

        _handleUnneededEvent: function (e) {
            e.preventDefault();
        },

        processUploadedImage: function (src) {
            var containerContext = this.get('container').one('#container canvas').invoke('getContext', '2d'),
                originalContext = this.get('container').one('#original canvas').invoke('getContext', '2d'),
                encryptedContext = this.get('container').one('#encrypted canvas').invoke('getContext', '2d'),
                minifiedImageData,
                combinedImageData,
                originalImg = new Image(),
                combiner = new Y.Combiner();

            // minify uploaded image and hide it in container
            originalImg.onload = function () {
                originalContext.drawImage(originalImg, 0, 0, 300, 300);

                minifiedImageData = combiner.minify(originalContext.getImageData(0, 0, 300, 300), 255);// TODO: could we directly pass it the image?
                originalContext.putImageData(minifiedImageData, 0, 0);

                combinedImageData = combiner.combine(containerContext.getImageData(0, 0, 300, 300), originalContext.getImageData(0, 0, 300, 300));
                encryptedContext.putImageData(combinedImageData, 0, 0);
            }

            originalImg.src = src;

            // swap contents
            this.get('container').one('#dropbox').addClass('hidden');
            this.get('container').one('#resultbox').removeClass('hidden');
        },

        initUI: function () {
            var dropbox = this.get('container').one('#dropbox'),
                containerContext = this.get('container').one('#container canvas').invoke('getContext', '2d'),
                containerImg = new Image();

            // init dropbox
            dropbox.on('dragover', this._handleUnneededEvent, this);
            dropbox.on('drop', this._handleFileDrop, this);

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

}, '0.1', {requires: ['view', 'combiner']});
