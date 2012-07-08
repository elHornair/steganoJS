YUI({
    modules: {
        'combiner': {
            fullpath: "js/combiner.js"
        },
        'canvas-helper': {
            fullpath: "js/helpers/canvas-helper.js"
        },
        'home-view': {
            fullpath: "js/view/HomeView.js"
        },
        'performance-view': {
            fullpath: "js/view/PerformanceView.js"
        },
        'upload-view': {
            fullpath: "js/view/UploadView.js"
        },
        'hidetext-view': {
            fullpath: "js/view/HideTextView.js"
        },
        'decrypt-view': {
            fullpath: "js/view/DecryptView.js"
        },
        'file-dropper': {
            fullpath: "js/widgets/FileDropper.js"
        }
    }
}).use('node', 'app-base', 'app-transitions', 'home-view', 'performance-view', 'upload-view', 'hidetext-view', 'decrypt-view', 'file-dropper', function (Y) {

    'use strict';

    var app;

    app = new Y.App({
        transitions: true,
        viewContainer: '#content',
        views: {
            home: {
                type: 'HomeView'
            },
            performance: {
                type: 'PerformanceView'
            },
            upload: {
                type: 'UploadView'
            },
            hidetext: {
                type: 'HideTextView'
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
            path: '/performance',
            callback: function () {
                this.showView('performance');
            }
        }, {
            path: '/upload',
            callback: function () {
                this.showView('upload');
            }
        }, {
            path: '/hidetext',
            callback: function () {
                this.showView('hidetext');
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
