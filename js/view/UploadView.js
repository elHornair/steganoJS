YUI.add('upload-view', function (Y) {

    'use strict';

    Y.UploadView = Y.Base.create('uploadView', Y.View, [], {

        _handleFileDrop: function (e, inst) {
            var files = e._event.dataTransfer.files,
                file,
                reader,
                inst = this;

            e.stopPropagation();
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
                inst.get('container').one('#dropbox').addClass('hidden');
                inst.processUploadedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        },

        processUploadedImage: function (src) {
            this.get('container').append('<img src="' + src + '" class="thumbnail"/>');
            // TODO: hide it in lena here
        },

        initUI: function () {
            var dropbox = this.get('container').one('#dropbox');
            dropbox.on('drop', this._handleFileDrop, this);// TODO: make this work in firefox
        },

        render: function () {
            var html = Y.one('#template_upload').getContent(),
                inst = this;

            this.get('container').setHTML(html);

            setTimeout(function () {
                inst.initUI();
            }, 100)// TODO: is there no event or callback for set html?

        }

    });

}, '0.1', {requires: ['view', 'combiner']});
