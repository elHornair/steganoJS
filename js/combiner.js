YUI.add('combiner', function (Y) {

    'use strict';

    function Combiner(config) {
        Combiner.superclass.constructor.apply(this, arguments);
    }

    Combiner.NAME = "combiner";

    Combiner.ATTRS = {
    }

    // TODO: make amount of used bits for hiding variable

    Y.extend(Combiner, Y.Base, {

        // maps an 8-bit value to a 1-bit value
        mapToOneBit: function (oriVal) {
            return (oriVal >= 128) ? 1 : 0;
        },

        // minifies an image so each pixel only needs 4 bit
        minify: function (sourceData, multiplier) {
            var originalData = sourceData.data,
                n = originalData.length,
                i;

            // loop through original data and minify it
            for (i = 0; i < n; i += 4) {
                originalData[i  ] = this.mapToOneBit(originalData[i  ]) * multiplier;// red
                originalData[i+1] = this.mapToOneBit(originalData[i+1]) * multiplier;// green
                originalData[i+2] = this.mapToOneBit(originalData[i+2]) * multiplier;// blue
            }

            return sourceData;
        },

        // combines two images by hiding the second in the first
        combine: function (containerData, sourceData) {
            var containerPixels = containerData.data,
                minifiedPixels = this.minify(sourceData, 1).data,
                n = minifiedPixels.length,
                i;

            for (i = 0; i < n; i += 4) {
                containerPixels[i  ] = ((containerPixels[i  ] >> 1) << 1) | minifiedPixels[i  ];
                containerPixels[i+1] = ((containerPixels[i+1] >> 1) << 1) | minifiedPixels[i+1];
                containerPixels[i+2] = ((containerPixels[i+2] >> 1) << 1) | minifiedPixels[i+2];
            }

            return containerData;
        }

    });

    Y.Combiner = Combiner;

}, '0.1', {requires: ['base']});
