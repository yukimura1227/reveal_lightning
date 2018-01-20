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
    write_file(settings.get('target_md.file_path'));
  });
  load_markdown_file();
});

function compile_and_display_markdown() {
  let input_markdown = editor.getValue();
  let result_html = marked(input_markdown);
  $('#js-markdown-result').html(result_html);
}

function load_markdown_file() {
  var text = read_file(settings.get('target_md.file_path'));
  editor.setValue(text);
  editor.gotoLine(0,0);
  compile_and_display_markdown();
}

