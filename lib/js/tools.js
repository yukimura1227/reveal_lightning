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
