YUI({
    modules: {
        'dummy': {
            fullpath: "js/dummy.js"
        }
    }
}).use('dummy', function (Y) {

    'use strict';

    Y.log("hello stego world");

});
