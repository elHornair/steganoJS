YUI({
    modules: {
        'combiner': {
            fullpath: "js/combiner.js"
        }
    }
}).use('node', 'combiner', function (Y) {

    'use strict';

    window.onload = function() {
        var containerContext = Y.one('#container canvas').invoke('getContext', '2d'),
            originalContext = Y.one('#original canvas').invoke('getContext', '2d'),
            hiddenContext = Y.one('#hidden canvas').invoke('getContext', '2d'),
            resultContext = Y.one('#result canvas').invoke('getContext', '2d'),
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
        }, 100);// TODO: improve, so that we somehow get an event

        // hide original image in container image
        setTimeout(function () {
            var combinedImageData = combiner.combine(containerContext.getImageData(0, 0, 300, 300), originalContext.getImageData(0, 0, 300, 300));
            resultContext.putImageData(combinedImageData, 0, 0);
        }, 100);// TODO: improve, so that we somehow get an event

    };

});
