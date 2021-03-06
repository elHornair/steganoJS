/*global window, navigator, YUI */

YUI.add('canvas-helper', function (Y) {

    'use strict';

    /****************************************************************************************/
    /************************************* constructor **************************************/
    /****************************************************************************************/
    function CanvasHelper(config) {
        CanvasHelper.superclass.constructor.apply(this, arguments);
    }

    CanvasHelper.NAME = 'canvasHelper';

    /****************************************************************************************/
    /************************************ public members ************************************/
    /****************************************************************************************/
    CanvasHelper.ATTRS = {
    };

    Y.extend(CanvasHelper, Y.Base, {

        /****************************************************************************************/
        /*********************************** private members ************************************/
        /****************************************************************************************/


        /****************************************************************************************/
        /*********************************** private methods ************************************/
        /****************************************************************************************/


        /****************************************************************************************/
        /************************************ public methods ************************************/
        /****************************************************************************************/

        replaceCanvasByImage: function (canvasElement) {
            var imgData = canvasElement.invoke('toDataURL', 'image/png');
            canvasElement.replace('<img src="' + imgData + '" class="thumbnail"/>');
        }

        /****************************************************************************************/
        /*********************************** extended methods ***********************************/
        /****************************************************************************************/


    });

    Y.CanvasHelper = CanvasHelper;

}, '0.1', {requires: ['base', 'node']});
