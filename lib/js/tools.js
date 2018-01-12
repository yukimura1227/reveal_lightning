"use strict";

$('#js-image-paste-btn').on('click', function() {
  var datetime = new Date().getTime();
  var write_dir = settings.get('target_md.file_dir') + '/';
  var image_file_name = datetime + '.png';
  var image_file_path = write_dir + image_file_name;
  var availableFormats = clipboard.availableFormats()
  var image_data = clipboard.readImage().toPng();
  console.log(image_data);
  fs.writeFile(image_file_path, image_data, function (error) {
    console.log(error);
  });
  // すぐにappendするとファイルが読み込めないので、waitしてからappend
  setTimeout(
    function () {
      put2editor("![](" + settings.get('target_md.file_relative_dir') + '/' + image_file_name + ")\n");
      $('#js-markdown-input').trigger('change');
    },
    500
  );
});

$('#js-chapter-separate-btn').on('click', function() {
  put2editor("\n----------\n");
});

$('#js-section-separate-btn').on('click', function() {
  put2editor("\n---\n");
});

$('#js-open-browser-btn').on('click', function() {
  shell.openExternal(settings.get('url.presentation'));
});

$('#js-print-btn').on('click', function() {
  shell.openExternal(settings.get('url.print'));
});

$('#js-reload-reveal-view-btn').on('click', function() {
  remote.getCurrentWindow().webContents.session.clearCache(() => {});
  $('#js-reveal-view')[0].contentDocument.location.reload(true);
});

$('#js-fragment-btn').on('click', function() {
  put2editor('<!-- .element: class="fragment" -->');
});

$('#js-fragment-grow-btn').on('click', function() {
  put2editor('<!-- .element: class="fragment grow" -->');
});

$('#js-fragment-shrink-btn').on('click', function() {
  put2editor('<!-- .element: class="fragment shrink" -->');
});

$('#js-fragment-fade-up-btn').on('click', function() {
  put2editor('<!-- .element: class="fragment fade-up" -->');
});

$('#js-fragment-fade-down-btn').on('click', function() {
  put2editor('<!-- .element: class="fragment fade-down" -->');
});

$('#js-fragment-fade-left-btn').on('click', function() {
  put2editor('<!-- .element: class="fragment fade-left" -->');
});

$('#js-fragment-fade-right-btn').on('click', function() {
  put2editor('<!-- .element: class="fragment fade-right" -->');
});

$('#js-fragment-current-visible-btn').on('click', function() {
  put2editor('<!-- .element: class="fragment current-visible" -->');
});

$('#js-fragment-highlight-current-blue-btn').on('click', function() {
  put2editor('<!-- .element: class="fragment highlight-current-blue" -->');
});

$('#js-fragment-highlight-red-btn').on('click', function() {
  put2editor('<!-- .element: class="fragment highlight-red" -->');
});

$('#js-style-full-width-btn').on('click', function() {
  put2editor('<!-- .element: style="width: 100%" -->');
});

function open_preference_dialog() {
  vex.open({
    unsafeContent: [
      '<form class="vex-dialog-form">',
        '<div class ="vex-dialog-input">',
          '<div class="uk-grid">',
            '<label class="uk-width-1-4 vertical-margin-middle" for="js-config-serverport">listen port</label>',
            '<div class="uk-width-1-4">',
              '<input type="number" id="js-config-serverport" value="' + settings.get('server.port') + '"/>',
            '</div>',
          '</div>',
        '</div>',
      '</form>'
    ].join(''),
    showCloseButton: false,
    afterOpen: function() {
      $("#js-config-serverport").on("change", function() {
        var port_new = $(this).val();
        settings.set('server', {port: port_new});
        // TODO: Simplify
        settings.set('url', {
          presentation: 'http://localhost:' + settings.get('server.port') + '/reveal_view.html',
          print: settings.get('url.presentation') + '?print-pdf'
        });
        call_start_server();
      });
    }
  });
};

// TODO: move to another file
function open_new_file_dialog() {
  vex.dialog.open({
    input: [
      '<div class="uk-grid">',
        '<label class="uk-width-1-4 vertical-margin-middle" for="input-file-keyword">filename</label>',
        '<div class="uk-width-3-4">',
          '<input type="text" name="file_keyword" id="input-file-keyword" style="width: 80%; required "/>.md',
        '</div>',
      '</div>'
    ].join(''),
    showCloseButton: false,
    buttons: [
      $.extend({}, vex.dialog.buttons.YES, { text: 'Save' }),
      $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
    ],
    callback: function (data) {
      if (!data) {
        console.log('Canceled');
      } else {
        var file_name          = data.file_keyword + '.md';
        var write_file_dir     = settings.get('app.work_dir') + '/' + data.file_keyword;
        var file_relative_dir  = 'work/' + data.file_keyword; // TODO: この work/ は汚い。app.work_dirにもっているので、修正したい
        var write_file_path    = write_file_dir + '/' + file_name;
        var relative_file_path = file_relative_dir + '/' + file_name;
        console.log('write_file_dir: ' + write_file_dir);
        if(!fs.existsSync(write_file_dir)) {
          fs.mkdirSync(write_file_dir);
          fs.writeFileSync(write_file_path, '');
          settings.set('target_md', { file_dir: write_file_dir, file_path: write_file_path, file_relative_dir: file_relative_dir });

          fs.writeFileSync(settings.get('app.root_dir') + '/load_target.json', '{ "load_target": "' + relative_file_path + '" }');

          load_markdown_file();
          $('#js-reload-reveal-view-btn').trigger('click');

        } else {
          alert('Error file is already exists!!');
        }
      }
    }
  });
};

function open_load_file_dialog() {
  vex.dialog.open({
    input: [
      '<div class="uk-grid">',
        '<label class="uk-width-1-4 vertical-margin-middle" for="open-file-keyword">filename</label>',
        '<div class="uk-width-3-4">',
          '<input type="text" name="file_keyword" id="open-file-keyword" style="width: 80%; required "/>.md',
        '</div>',
      '</div>'
    ].join(''),
    showCloseButton: false,
    buttons: [
      $.extend({}, vex.dialog.buttons.YES, { text: 'Open' }),
      $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
    ],
    callback: function (data) {
      if (!data) {
        console.log('Canceled');
      } else {
        var file_name          = data.file_keyword + '.md';
        var read_file_dir     = settings.get('app.work_dir') + '/' + data.file_keyword;
        var file_relative_dir  = 'work/' + data.file_keyword; // TODO: この work/ は汚い。app.work_dirにもっているので、修正したい
        var read_file_path    = read_file_dir + '/' + file_name;
        var relative_file_path = file_relative_dir + '/' + file_name;
        console.log('read_file_dir: ' + read_file_dir);
        if(fs.existsSync(read_file_dir)) {
          settings.set('target_md', { file_dir: read_file_dir, file_path: read_file_path, file_relative_dir: file_relative_dir });

          fs.writeFileSync(settings.get('app.root_dir') + '/load_target.json', '{ "load_target": "' + relative_file_path + '" }');

          load_markdown_file();
          $('#js-reload-reveal-view-btn').trigger('click');

        } else {
          alert('File Not Found!!');
        }
      }
    }
  });
}
