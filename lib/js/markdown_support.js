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

  load_markdown_file();

  editor.$blockScrolling = Infinity; // ワーニングに対処
  if(process.platform == 'darwin') { // Ctrl+Pが効かない問題に対処
    editor.commands.bindKey("Ctrl-P", "golineup");
  }
  editor.getSession().getDocument().on('change', function() {
    compile_and_display_markdown();
    write_file(settings.get('target_md.file_path'));
    // $('#js-reload-reveal-view-btn').trigger('click');
  });

  editor.getSession().selection.on("changeCursor", function(){
    adjust_reveal_slide();
  });

  $('#js-reveal-view').on('load', function(){
    adjust_reveal_slide();
  });
});

function adjust_reveal_slide() {
  var cursorPosition = editor.getCursorPosition();
  var editorDocument = editor.getSession().getDocument();
  var upperLines = editorDocument.getLines(0, cursorPosition.row);
  var distIndexX = 0;
  var distIndexY = 0;
  var last_chapter_separator_row = 0;
  for( var i = 0; i < upperLines.length; i++ ) {
    if( upperLines[i] === '----------' ) {
      distIndexX++;
      last_chapter_separator_row = i;
    }
  }
  for( var i = last_chapter_separator_row; i < upperLines.length; i++ ) {
    if( upperLines[i] === '---') {
      distIndexY++;
    }
  }

  if($('#js-reveal-view')[0].contentWindow.Reveal != undefined) {
    $('#js-reveal-view')[0].contentWindow.Reveal.slide(distIndexX, distIndexY);
  }
}

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

