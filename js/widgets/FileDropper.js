/*global window, navigator, YUI */

YUI.add('file-dropper', function (Y) {

    'use strict';

    /****************************************************************************************/
    /************************************* constructor **************************************/
    /****************************************************************************************/
    function FileDropper(config) {
        FileDropper.superclass.constructor.apply(this, arguments);
    }

    FileDropper.NAME = 'fileDropper';

    /****************************************************************************************/
    /************************************ public members ************************************/
    /****************************************************************************************/

    FileDropper.ATTRS = {
    };

    Y.extend(FileDropper, Y.Widget, {

        /****************************************************************************************/
        /*********************************** private members ************************************/
        /****************************************************************************************/


        /****************************************************************************************/
        /*********************************** private methods ************************************/
        /****************************************************************************************/


        /****************************************************************************************/
        /************************************ public methods ************************************/
        /****************************************************************************************/


        /****************************************************************************************/
        /************************************ event handlers ************************************/
        /****************************************************************************************/

         _handleUnneededEvent: function (e) {
            e.preventDefault();
        },

         _handleDragOver: function (e) {
             this.get('contentBox').addClass('over');
        },

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
                Y.fire('filedropper:drop', {
                    src: e.target.result
                });
            };
            reader.readAsDataURL(file);
        },

        /****************************************************************************************/
        /*********************************** extended methods ***********************************/
        /****************************************************************************************/

        bindUI: function () {
            // add dropbox events
            this.get('contentBox').once('dragover', this._handleDragOver, this);
            this.get('contentBox').on('dragover', this._handleUnneededEvent, this);
            this.get('contentBox').on('drop', this._handleFileDrop, this);
        }

    });

    Y.FileDropper = FileDropper;

}, '0.1', {requires: ['node', 'widget', 'event-custom']});
