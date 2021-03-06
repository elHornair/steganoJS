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
                i,
                numRepetitions = 39,
                textToHide = '',
                textToHideOri = 'Nach der Veröffentlichung der Spezifikation von HTML 4.0 im Dezember 1997 lag die Weiterentwicklung von HTML lange brach. Außer der Version 4.01 im Dezember 1999, die lediglich Fehlerkorrekturen enthält, gab es bis zum April 2009 keine Aktualisierungen der Auszeichnungssprache mehr. Das World Wide Web Consortium (W3C) setzte auf XML, welches zum Nachfolger von HTML werden sollte, und reformulierte HTML 4.01 zu der XML-basierten Auszeichnungssprache XHTML 1.0. Dabei blieb der Funktionsumfang von HTML 4.01 ohne Änderungen erhalten. Daraufhin begann das W3C mit der Entwicklung von XHTML 1.1 und später von XHTML 2.0, was nicht mehr viel mit HTML 4.01 gemeinsam hatte, und wollte vieles besser machen als in HTML. Dies führte dazu, dass XHTML 1.1 und XHTML 2.0 durch diese Neuentwicklungen nicht mehr abwärtskompatibel waren. Außerdem war die Erstellung von XHTML-2.0-Dokumenten in vielen Punkten im Vergleich zu HTML sehr schwer und erforderte viel Hintergrundwissen. Die Entwicklung von CSS verlief zu diesem Zeitpunkt ebenfalls nur sehr langsam, weshalb das W3C immer mehr in die Kritik geriet. Um diesen Entwicklungen entgegenzuwirken, veröffentlichte die von mehreren Browserherstellern gegründete Web Hypertext Application Technology Working Group (WHATWG) Mitte 2004 unter dem Namen Web Applications 1.0 den ersten Vorschlag für HTML5. Am 27. Januar 2006 kündigte Tim Berners-Lee, der Gründer und Vorsitzende des World Wide Web Consortiums, eine neue Arbeitsgruppe mit dem Ziel der Weiterentwicklung von HTML an.[3] Das W3C nutzte als Grundlage für seine Arbeit an HTML5 einen Fork der Version der WHATWG. Damit schuf sich das W3C Konkurrenz im eigenen Haus, da dieses ebenfalls schon die Entwicklung von XHTML 2.0, einem rein XML-basierten Format zur Webseitenauszeichnung, vorantrieb. Um die Konkurrenz innerhalb des W3C abzumildern, wurden zwischen November 2006 und März 2007 die vorhandenen Arbeitsgruppen beim W3C umgestaltet. HTML5 und XHTML 2.0 wurden als verwandte Sprachen mit unterschiedlichen Zielgruppen definiert.[4] Im Mai 2007 entschieden die Mitglieder der HTML-Arbeitsgruppe in einer Abstimmung, dass der Web-Applications-1.0-Entwurf der WHATWG als Startpunkt zur Diskussion und Weiterentwicklung von HTML verwendet werden soll.[5][6] Seitdem entwickeln das W3C und die WHATWG gemeinsam an der HTML5-Spezifikation. Mitte 2009 gab das W3C bekannt, dass die Entwicklung von XHTML 2.0 mit Ende desselben Jahres nicht mehr weitergeführt werde.[7] Die nächste Generation der Auszeichnungssprachen für das Web ist damit keine neue Variante von XHTML, sondern HTML5. Verschiedene Arbeitsmodelle von W3C und WHATWG [Bearbeiten] Die WHATWG verfolgt ein versionsloses Modell der Entwicklung. Sie arbeitet an einem sogenannten Living Standard, also einer Spezifikation, die einer ständigen Korrektur und Erweiterung unterliegt.[8] Daher verzichtet die WHATWG auf die Versionsangabe „5“ und spricht nur noch vom „HTML-Standard“.[9] Ziel der HTML-Arbeitsgruppe beim W3C ist es hingegen, eine stabile Momentaufnahme dieser Spezifikation unter dem Namen HTML5 zu publizieren. Dazu wird ein vordefiniertes Prozedere durchlaufen, bis die Spezifikation schließlich zu einer W3C-Empfehlung (Recommendation) heranreift.[10] Das W3C geht davon aus, dass die vollständige HTML5-Spezifikation bis zum Jahr 2014 breit unterstützt werden wird und damit als Empfehlung veröffentlicht werden kann.[11] Verhältnis der Spezifikationen des W3C und der WHATWG [Bearbeiten] Verhältnis von Webtechnologie-Spezifikationen im Umfeld von HTML5 Der Verfasser (engl. editor) der Spezifikation ist Ian Hickson,[12] Gründer der WHATWG und Angestellter von Google.[13] Aus dem von ihm bearbeiteten Rohtext werden verschiedene Spezifikationen generiert, sowohl die auf Seiten der WHATWG als auch die W3C-Pendants. Die WHATWG-HTML-Spezifikation integriert mehrere verwandte Teilspezifikationen, welche seitens des W3C in einzelne Dokumente aufgesplittet werden.[14] Sie können damit unabhängig von der HTML5-Hauptspezifikation den W3C-Entwicklungsprozess durchlaufen. Diese separaten Standards sind Microdata-Metadaten, der 2D-Zeichenkontext des Canvas-Element sowie dokumentübergreifende Nachrichten (HTML5 Web Messaging). W3C-Veröffentlichungen [Bearbeiten] Im Folgenden sind die Veröffentlichungen der HTML5-Entwürfe durch das W3C aufgeführt. Neben den regelmäßigen Arbeitsentwürfen (Working Drafts) veröffentlicht das W3C in Abständen von Tagen sogenannte Editor’s Drafts. Die jeweils tagesaktuelle Fassung des Entwurfs – erweitert um WHATWG-spezifische Elemente – ist auf der Webseite der WHATWG verfügbar. Fortschritt in der Entwicklung [Bearbeiten] In der Spezifikation der WHATWG wird darauf hingewiesen, dass bestimmte Abschnitte ausgereifter sind als andere. Von den reiferen Neuentwicklungen sind einige bereits in aktuellen Browserversionen enthalten und können verwendet werden.[22] Fertigstellung von HTML5 [Bearbeiten] Laut dem Zeitplan des W3C soll HTML5 2014 offiziell verabschiedet, d. h. zu einer W3C Recommendation werden. Im Mai 2011 erhielt HTML5 beim W3C den Status „Last Call“, welcher als letzte Aufforderung dienen soll, Kommentare zum HTML5-Entwurf einzureichen.[23] Die WHATWG hat den Status „Last Call“ bereits am 27. Oktober 2009 ausgerufen.[24] Der Status „Last Call“ bedeutet aber auch, dass HTML5 faktisch bereits einen fertigen Zustand angenommen hat, welcher mit einem Release Candidate vergleichbar ist. In den meisten Browsern ist HTML5 bereits (wenn auch unvollständig) implementiert. Sofern alle gängigen Browser die entsprechenden Funktionen unterstützen, können Webentwickler Teile von HTML5 also bereits heute (gegebenenfalls mit einem Fallback) einsetzen. Diese Empfehlung spricht auch das W3C aus.[25] Ziele von HTML5 [Bearbeiten] Die ersten wichtigen Ziele für HTML5 wurden von Tim Berners-Lee in dessen Blogeintrag „Reinventing HTML“ (HTML neu erfinden) festgelegt:[26] An der Entwicklung sollen dabei vor allem auch die Gruppen beteiligt sein, die HTML verwenden (Webautoren, Hersteller von Browsern). Dabei muss HTML inkrementell, also durch Überarbeitung und Erweiterung der Vorversion, entwickelt werden, und der Übergang zu wohlgeformten Dokumenten soll dadurch weiter vorangetrieben werden. Die Entwicklung von Formularen in HTML soll erweitert werden und im Idealfall einen Schritt von der bestehenden Formularstruktur hin zu XForms bilden. Im Zuge der Einrichtung der neuen HTML-Arbeitsgruppe[27] und als Teil der architektonischen Vision für HTML, XForms und XHTML 2.0[4] wurden diese Ziele detaillierter festgelegt, teilweise verändert und um weitere Punkte ergänzt: Im Gegensatz zur bisherigen Vorgehensweise, in jeder Spezifikation nur die Unterschiede zu einer alten Version abzubilden, soll eine vollständige Spezifikation geschrieben werden. Das Vokabular von HTML muss als klassisches HTML und als XML-Dialekt verfasst werden können. Unabhängig von dieser Form muss das Vokabular in ein definiertes Infoset, das heißt in eine DOM-Abbildung des Quelltextes umgesetzt werden können. Zusätzlich wurden zum Aufgabenbereich der Arbeitsgruppe die Definition von DOM-Schnittstellen für die Arbeit mit dem HTML-Vokabular sowie eine separate mit eingebundenen Medien festgelegt. Die Arbeitsgruppe soll Formulare und allgemeine Benutzereingabeelemente wie Fortschrittsanzeigen oder Menüs entwickeln und Schnittstellen für benutzerdefinierte WYSIWYG-Bearbeitungsfunktionen definieren. Nach Gründung der Arbeitsgruppe wurden die HTML-Gestaltungsprinzipien[28] als erstes Dokument veröffentlicht. Darin werden weitere Zielsetzungen ausführlich erläutert. Dazu gehören etwa: Kompatibilität Bestehender Inhalt muss weiterhin unterstützt werden. Neue Elemente der Sprache dürfen den bestehenden Inhalt nicht negativ beeinflussen. Verwendbarkeit Neue Funktionen sollen echte Probleme lösen, und dies vorrangig für Autoren, dann Browserhersteller und zuletzt der „reinen Lehre“ dienend; Funktionen jedoch, die bereits einen bestimmten Zweck erfüllen, sollen nicht neu erfunden werden. Sicherheit Bei der Entwicklung neuer Funktionen müssen Sicherheitsaspekte berücksichtigt werden. Konsistenz Teile aus XML, die in XHTML Anwendung finden, sollen auch in HTML erlaubt werden. HTML und XHTML besitzen eine gemeinsame DOM-Abbildung. Vereinfachung Durch genau definiertes Verhalten (auch in Fehlersituationen) und geringe Komplexität soll HTML interoperabel implementiert werden können. Universalität HTML soll auf allen Endgeräten und mit Inhalt in allen Weltsprachen verwendbar sein. Barrierefreiheit Die Barrierefreiheit von Inhalt und Funktion soll gewährleistet sein.Nach der Veröffentlichung der Spezifikation von HTML 4.0 im Dezember 1997 lag die Weiterentwicklung von HTML lange brach. Außer der Version 4.01  im Dezember 1999, die lediglich Fehlerkorrekturen enthält, gab es bis zum April 2009 keine Aktualisierungen der Auszeichnungssprache mehr. Das World Wide Web Consortium (W3C) setzte auf XML, welches zum Nachfolger von HTML werden sollte, und reformulierte HTML 4.01 zu der XML-basierten Auszeichnungssprache XHTML 1.0. Dabei blieb der Funktionsumfang von HTML 4.01 ohne Änderungen erhalten. Daraufhin begann das W3C mit der Entwicklung von XHTML 1.1 und später von XHTML 2.0, was nicht mehr viel mit HTML 4.01 gemeinsam hatte, und wollte vieles besser machen als in HTML. Dies führte dazu, dass XHTML  1.1 und XHTML 2.0 durch diese Neuentwicklungen nicht mehr abwärtskompatibel waren. Außerdem war die Erstellung von XHTML-2.0-Dokumenten in vielen Punkten im Vergleich zu HTML sehr schwer und erforderte viel Hintergrundwissen. Die Entwicklung von CSS verlief zu diesem Zeitpunkt ebenfalls nur sehr langsam, weshalb das W3C immer mehr in die Kritik geriet. Um diesen Entwicklungen entgegenzuwirken, veröffentlichte die von mehreren Browserherstellern gegründete Web Hypertext Application Technology Working Group (WHATWG) Mitte 2004 unter dem Namen Web Applications 1.0 den ersten Vorschlag für HTML5. Am 27. Januar 2006 kündigte Tim Berners-Lee etwas an...';


            // expand text to hide
            for (i=0; i<numRepetitions; i++) {
                textToHide += textToHideOri;
            }

            Y.log('amount of hidden characters: ' + (textToHide.length));

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
