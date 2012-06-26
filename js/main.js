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
        },
        'decrypt-view': {
            fullpath: "js/view/DecryptView.js"
        },
        'file-dropper': {
            fullpath: "js/widgets/FileDropper.js"
        }
    }
}).use('node', 'app-base', 'app-transitions', 'home-view', 'upload-view', 'decrypt-view', 'file-dropper', function (Y) {

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
            },
            decrypt: {
                type: 'DecryptView'
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
        }, {
            path: '/decrypt',
            callback: function () {
                this.showView('decrypt');
            }
        }]
    });

    app.navigate('/');

});
