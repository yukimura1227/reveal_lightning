var editor;
window.addEventListener('DOMContentLoaded',function() {
  var renderer = new marked.Renderer();
  renderer.code = function(code, language) {
    return '<pre><code class="hljs">' + require('highlight.js').highlightAuto(code).value + '</code></pre>';
  };
  marked.setOptions({
    renderer: renderer,
  });

  editor = ace.edit("js-markdown-input");
  editor.getSession().setMode('ace/mode/markdown');
  editor.$blockScrolling = Infinity; // ワーニングに対処
  if(process.platform == 'darwin') { // Ctrl+Pが効かない問題に対処
    editor.commands.bindKey("Ctrl-P", "golineup");
  }
  editor.getSession().on('change', function() {
    compile_and_display_markdown();
    write_file(target_md_filepath);
  });
  initialize_load();
});

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

$('#js-reload-reveal-view-btn').on('click', function() {
  $('#js-reveal-view')[0].contentDocument.location.reload(true);
});

function compile_and_display_markdown() {
  let input_markdown = editor.getValue();
  let result_html = marked(input_markdown);
  $('#js-markdown-result').html(result_html);
}

function initialize_load() {
  read_file(target_md_filepath);
  compile_and_display_markdown();
}

