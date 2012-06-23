YUI({
    modules: {
        'combiner': {
            fullpath: "js/combiner.js"
        },
        'home-view': {
            fullpath: "js/view/HomeView.js"
        }
    }
}).use('node', 'app-base', 'app-transitions', 'home-view', function (Y) {

    'use strict';

    var app;

    app = new Y.App({
        transitions: true,
        viewContainer: '#content',
        views: {
            home: {
                type: 'HomeView'
            }
        },
        routes: [{
            path: '/',
            callback: function () {
                this.showView('home');
            }
        }]
    });

    app.navigate('/');

});
