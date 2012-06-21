YUI({
    modules: {
        'dummy': {
            fullpath: "js/dummy.js"
        }
    }
}).use('dummy', function (Y) {

    'use strict';

    window.onload = function() {
        var canvas = document.getElementById('drawing_area'),
            context = canvas.getContext("2d"),
            myImg = new Image();

        myImg.onload = function() {
          context.drawImage(myImg, 0, 0, 300, 300);
        };

        myImg.src = "img/lena.bmp";
    };

});
