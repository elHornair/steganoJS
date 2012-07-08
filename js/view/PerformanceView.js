YUI.add('performance-view', function (Y) {

    'use strict';

    Y.PerformanceView = Y.Base.create('performanceView', Y.View, [], {

        _containerContext: null,
        _containerImg: null,
        _combiner: new Y.Combiner(),
        _canvasHelper: new Y.CanvasHelper(),
        _imageSize: 1024,

        _handleImageReady: function () {
            var encryptedCanvas = this.get('container').one('#encrypted canvas'),
                encryptedContext = encryptedCanvas.invoke('getContext', '2d'),
                inst = this,
                startTime,
                endTime,
                textToHide = 'bald fertig. juppiii';

            // draw container image
            this._containerContext.drawImage(this._containerImg, 0, 0, this._imageSize, this._imageSize);

            // hide text in container image
            startTime = new Date().getTime();
            this._combiner.hideText(this._containerContext.getImageData(0, 0, this._imageSize, this._imageSize), textToHide, function (combinedData){
                endTime = new Date().getTime();

                Y.log ('time to hide text (milliseconds): ' + (endTime - startTime));

                // draw encrypted image
                encryptedContext.putImageData(combinedData, 0, 0);

                // make combined image downloadable
                inst._canvasHelper.replaceCanvasByImage(encryptedCanvas);
            });

        },

        initUI: function () {
            var inst = this;

            // init contexts
            this._containerContext = this.get('container').one('#container canvas').invoke('getContext', '2d');
            this._containerImg = new Image();

            // add listeners
            this._containerImg.addEventListener('load', function () {
                inst._handleImageReady();
            });

            // load image
            this._containerImg.src = "img/lena_1024.png";

        },

        render: function () {
            var html = Y.one('#template_performance').getContent(),
                inst = this;

            this.get('container').setHTML(html);

            setTimeout(function () {
                inst.initUI();
            }, 100)// TODO: is there no event or callback for set html?

        }

    });

}, '0.1', {requires: ['view', 'combiner', 'canvas-helper']});
