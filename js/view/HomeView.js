YUI.add('home-view', function (Y) {

    'use strict';

    Y.HomeView = Y.Base.create('homeView', Y.View, [], {

        _readyImagesCounter: 0,
        _containerContext: null,
        _originalContext: null,
        _containerImg: null,
        _originalImg: null,
        _combiner: new Y.Combiner(),

        _areImagesReady: function () {
            return this._readyImagesCounter >= 2 ? true : false;
        },

        _handleImageReady: function () {
            this._readyImagesCounter += 1;
            if (this._areImagesReady()) {
                this._handleAllImagesReady();
            }
        },

        _handleAllImagesReady: function () {
            var minifiedImageData,
                combinedImageData,
                extractedImageData,
                hiddenContext = this.get('container').one('#hidden canvas').invoke('getContext', '2d'),
                encryptedCanvas = this.get('container').one('#encrypted canvas'),
                encryptedContext = encryptedCanvas.invoke('getContext', '2d'),
                decryptedContext = this.get('container').one('#decrypted canvas').invoke('getContext', '2d'),
                textToHide = 'das ist das haus vom nikolaus',
                inst = this;

            // draw original images
            this._containerContext.drawImage(this._containerImg, 0, 0, 300, 300);
            this._originalContext.drawImage(this._originalImg, 0, 0, 300, 300);

            // draw minified content image
            minifiedImageData = this._combiner.minify(this._originalContext.getImageData(0, 0, 300, 300), 255);// TODO: could we directly pass it the image?
            hiddenContext.putImageData(minifiedImageData, 0, 0);

            // hide content image in container image
            //combinedImageData = this._combiner.combine(this._containerContext.getImageData(0, 0, 300, 300), this._originalContext.getImageData(0, 0, 300, 300));
            //encryptedContext.putImageData(combinedImageData, 0, 0);

            // hide text in container image
            combinedImageData = this._combiner.hideText(this._containerContext.getImageData(0, 0, 300, 300), textToHide, function (combinedData){
                encryptedContext.putImageData(combinedData, 0, 0);

                // extract hidden image again
                extractedImageData = inst._combiner.extract(encryptedContext.getImageData(0, 0, 300, 300));
                decryptedContext.putImageData(extractedImageData, 0, 0);

                // make combined image downloadable
                Y.one('#result').append('<img src="' + encryptedCanvas.invoke('toDataURL', 'image/png') + '" class="thumbnail"/>');
            });

        },

        initUI: function () {
            var inst = this;

            // init contexts
            this._containerContext = this.get('container').one('#container canvas').invoke('getContext', '2d');
            this._originalContext = this.get('container').one('#original canvas').invoke('getContext', '2d');
            this._containerImg = new Image();
            this._originalImg = new Image();

            // add listeners
            this._containerImg.addEventListener('load', function () {
                inst._handleImageReady();
            });
            this._originalImg.addEventListener('load', function () {
                inst._handleImageReady();
            });

            // load images
            this._containerImg.src = "img/lena.png";
            this._originalImg.src = "img/fribourg.png";

        },

        render: function () {
            var html = Y.one('#template_home').getContent(),
                inst = this;

            this.get('container').setHTML(html);

            setTimeout(function () {
                inst.initUI();
            }, 100)// TODO: is there no event or callback for set html?

        }

    });

}, '0.1', {requires: ['view', 'combiner']});
