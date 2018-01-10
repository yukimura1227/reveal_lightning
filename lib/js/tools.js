"use strict";

$('#js-image-paste-btn').on('click', function() {
  var image_file_name = new Date().getTime() + '.png';
  var availableFormats = clipboard.availableFormats()
  var image_data = clipboard.readImage().toPng();
  console.log(image_data);
  fs.writeFile(image_file_name, image_data, function (error) {
    console.log(error);
  });
  // すぐにappendするとファイルが読み込めないので、waitしてからappend
  setTimeout(
    function () {
      put2editor("![](" + image_file_name + ")\n");
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

// TODO: remove cancel button and OK button
function open_preference_dialog() {
  vex.dialog.open({
    input: [
      '<form class="uk-form">',
        '<div class="uk-grid">',
          '<label class="uk-width-1-4 vertical-margin-middle" for="js-config-serverport">listen port</label>',
          '<div class="uk-width-1-4">',
            '<input type="number" id="js-config-serverport" value="' + settings.get('server.port') + '"/>',
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
