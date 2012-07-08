YUI.add('hidetext-view', function (Y) {

    'use strict';

    Y.HideTextView = Y.Base.create('hideTextView', Y.View, [], {

        _containerImgSrc: 'img/lena.png',
        _canvasHelper: new Y.CanvasHelper(),
        _imageSize: 300,

        _handleDoneBtClicked: function (e) {
            var inputNode = Y.one('#text_input'),
                textToHide = inputNode.get('value'),
                containerContext = this.get('container').one('#container canvas').invoke('getContext', '2d'),
                encryptedCanvas = this.get('container').one('#encrypted canvas'),
                encryptedContext = encryptedCanvas.invoke('getContext', '2d'),
                combiner = new Y.Combiner(),
                inst = this;

            // show typed text
            this.get('container').one('#hidden_text .result').set('text', textToHide);

            // hide text in container image
            combiner.hideText(containerContext.getImageData(0, 0, this._imageSize, this._imageSize), textToHide, function (combinedData){
                encryptedContext.putImageData(combinedData, 0, 0);

                // make combined image downloadable
                inst._canvasHelper.replaceCanvasByImage(encryptedCanvas);
            });

            // hide input elements
            inputNode.addClass('hidden');
            this.get('container').one('#bt_done').addClass('hidden');

            // show result
            this.get('container').one('#resultbox').removeClass('hidden');
        },

        initUI: function () {
            var containerContext = this.get('container').one('#container canvas').invoke('getContext', '2d'),
                containerImg = new Image();

            // draw container image
            containerImg.onload = function() {
                containerContext.drawImage(containerImg, 0, 0, 300, 300);
            }
            containerImg.src = this._containerImgSrc;

            Y.one('#bt_done').once('click', this._handleDoneBtClicked, this);
        },

        render: function () {
            var html = Y.one('#template_hidetext').getContent(),
                inst = this;

            this.get('container').setHTML(html);

            setTimeout(function () {
                inst.initUI();
            }, 100)// TODO: is there no event or callback for set html?
        }

    });

}, '0.1', {requires: ['view', 'combiner', 'event-custom', 'canvas-helper']});
