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
  shell.openExternal(presentation_url);
});

$('#js-print-btn').on('click', function() {
  shell.openExternal(print_url);
});

$('#js-reload-reveal-view-btn').on('click', function() {
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

menu.append(
  new remote.MenuItem({
    label: 'add chapter separetor',
    click: function() {
      $('#js-chapter-separate-btn').trigger('click');
    }
  })
);

menu.append(
  new remote.MenuItem({
    label: 'add section separetor',
    click: function() {
      $('#js-section-separate-btn').trigger('click');
    }
  })
);
