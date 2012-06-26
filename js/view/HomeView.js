YUI.add('home-view', function (Y) {

    'use strict';

    Y.HomeView = Y.Base.create('homeView', Y.View, [], {

        initUI: function () {
            var encryptedCanvas = this.get('container').one('#encrypted canvas'),
                containerContext = this.get('container').one('#container canvas').invoke('getContext', '2d'),
                originalContext = this.get('container').one('#original canvas').invoke('getContext', '2d'),
                hiddenContext = this.get('container').one('#hidden canvas').invoke('getContext', '2d'),
                encryptedContext = encryptedCanvas.invoke('getContext', '2d'),
                decryptedContext = this.get('container').one('#decrypted canvas').invoke('getContext', '2d'),
                containerImg = new Image(),
                originalImg = new Image(),
                combiner = new Y.Combiner();

            // draw original image
            containerImg.onload = function() {
                containerContext.drawImage(containerImg, 0, 0, 300, 300);
            };

            originalImg.onload = function() {
                originalContext.drawImage(originalImg, 0, 0, 300, 300);
            };

            containerImg.src = "img/lena.png";
            originalImg.src = "img/fribourg.png";

            // minify original image
            setTimeout(function () {
                var minifiedImageData = combiner.minify(originalContext.getImageData(0, 0, 300, 300), 255);// TODO: could we directly pass it the image?
                hiddenContext.putImageData(minifiedImageData, 0, 0);
            }, 200);// TODO: improve, so that we somehow get an event

            // hide original image in container image
            setTimeout(function () {
                //var combinedImageData = combiner.combine(containerContext.getImageData(0, 0, 300, 300), originalContext.getImageData(0, 0, 300, 300));
                //encryptedContext.putImageData(combinedImageData, 0, 0);

                var combinedImageData = combiner.hideText(containerContext.getImageData(0, 0, 300, 300), 'das ist das haus vom nikolaus');
                encryptedContext.putImageData(combinedImageData, 0, 0);

            }, 200);// TODO: improve, so that we somehow get an event

            // extract hidden image from container image
            setTimeout(function () {
                var extractedImageData = combiner.extract(encryptedContext.getImageData(0, 0, 300, 300));
                decryptedContext.putImageData(extractedImageData, 0, 0);
            }, 500);// TODO: improve, so that we somehow get an event

            // write encrypted image to the DOM as an actual PNG
            setTimeout(function () {
                var imgData = encryptedCanvas.invoke('toDataURL', 'image/png');
                Y.one('#result').append('<img src="' + imgData + '" class="thumbnail"/>');
            }, 800);// TODO: improve, so that we somehow get an event*/

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
