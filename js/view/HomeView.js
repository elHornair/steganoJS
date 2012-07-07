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
                textToHide = 'Nach der Veröffentlichung der Spezifikation von HTML 4.0 im Dezember 1997 lag die Weiterentwicklung von HTML lange brach. Außer der Version 4.01 im Dezember 1999, die lediglich Fehlerkorrekturen enthält, gab es bis zum April 2009 keine Aktualisierungen der Auszeichnungssprache mehr. Das World Wide Web Consortium (W3C) setzte auf XML, welches zum Nachfolger von HTML werden sollte, und reformulierte HTML 4.01 zu der XML-basierten Auszeichnungssprache XHTML 1.0. Dabei blieb der Funktionsumfang von HTML 4.01 ohne Änderungen erhalten. Daraufhin begann das W3C mit der Entwicklung von XHTML 1.1 und später von XHTML 2.0, was nicht mehr viel mit HTML 4.01 gemeinsam hatte, und wollte vieles besser machen als in HTML. Dies führte dazu, dass XHTML 1.1 und XHTML 2.0 durch diese Neuentwicklungen nicht mehr abwärtskompatibel waren. Außerdem war die Erstellung von XHTML-2.0-Dokumenten in vielen Punkten im Vergleich zu HTML sehr schwer und erforderte viel Hintergrundwissen. Die Entwicklung von CSS verlief zu diesem Zeitpunkt ebenfalls nur sehr langsam, weshalb das W3C immer mehr in die Kritik geriet. Um diesen Entwicklungen entgegenzuwirken, veröffentlichte die von mehreren Browserherstellern gegründete Web Hypertext Application Technology Working Group (WHATWG) Mitte 2004 unter dem Namen Web Applications 1.0 den ersten Vorschlag für HTML5. Am 27. Januar 2006 kündigte Tim Berners-Lee, der Gründer und Vorsitzende des World Wide Web Consortiums, eine neue Arbeitsgruppe mit dem Ziel der Weiterentwicklung von HTML an.[3] Das W3C nutzte als Grundlage für seine Arbeit an HTML5 einen Fork der Version der WHATWG. Damit schuf sich das W3C Konkurrenz im eigenen Haus, da dieses ebenfalls schon die Entwicklung von XHTML 2.0, einem rein XML-basierten Format zur Webseitenauszeichnung, vorantrieb. Um die Konkurrenz innerhalb des W3C abzumildern, wurden zwischen November 2006 und März 2007 die vorhandenen Arbeitsgruppen beim W3C umgestaltet. HTML5 und XHTML 2.0 wurden als verwandte Sprachen mit unterschiedlichen Zielgruppen definiert.[4] Im Mai 2007 entschieden die Mitglieder der HTML-Arbeitsgruppe in einer Abstimmung, dass der Web-Applications-1.0-Entwurf der WHATWG als Startpunkt zur Diskussion und Weiterentwicklung von HTML verwendet werden soll.[5][6] Seitdem entwickeln das W3C und die WHATWG gemeinsam an der HTML5-Spezifikation. Mitte 2009 gab das W3C bekannt, dass die Entwicklung von XHTML 2.0 mit Ende desselben Jahres nicht mehr weitergeführt werde.[7] Die nächste Generation der Auszeichnungssprachen für das Web ist damit keine neue Variante von XHTML, sondern HTML5.',
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
