YUI({
    modules: {
        'combiner': {
            fullpath: "js/combiner.js"
        },
        'home-view': {
            fullpath: "js/view/HomeView.js"
        },
        'upload-view': {
            fullpath: "js/view/UploadView.js"
        }
    }
}).use('node', 'app-base', 'app-transitions', 'home-view', 'upload-view', function (Y) {

    'use strict';

    var app;

    app = new Y.App({
        transitions: true,
        viewContainer: '#content',
        views: {
            home: {
                type: 'HomeView'
            },
            upload: {
                type: 'UploadView'
            }
        },
        routes: [{
            path: '/',
            callback: function () {
                this.showView('home');
            }
        }, {
            path: '/upload',
            callback: function () {
                this.showView('upload');
            }
        }]
    });

    app.navigate('/');

});
