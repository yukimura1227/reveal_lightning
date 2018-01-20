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

    // NOTE: if you want to auto reload [reveal-preview area]
    // then cancel comment below
    // $('#js-reload-reveal-view-btn').trigger('click');
  });

  editor.getSession().selection.on("changeCursor", function(){
    adjust_reveal_slide();
    adjust_markdown_preview_scroll();
  });

  $('#js-reveal-view').on('load', function(){
    adjust_reveal_slide();
  });
});

function get_current_line() {
  var editorDocument = editor.getSession().getDocument();
  var cursorPosition = editor.getCursorPosition();
  return editorDocument.getLines(cursorPosition.row, cursorPosition.row)[0];
}

function get_upper_lines() {
  var editorDocument = editor.getSession().getDocument();
  var cursorPosition = editor.getCursorPosition();
  var upper_lines = editorDocument.getLines(0, cursorPosition.row);
  return upper_lines;
}

function is_separator(str) {
  return is_section_separator(str) || is_chapter_separator(str);
}

function is_chapter_separator(str) {
  return str === '----------'
}

function is_section_separator(str) {
  return str === '---';
}

function adjust_markdown_preview_scroll() {
  var current_line = get_current_line();
  if (!is_separator(current_line)) {
    return;
  }

  var upper_lines = get_upper_lines();
  var hr_count = -1;
  for( var i = 0; i < upper_lines.length; i++ ) {
    if( is_separator(upper_lines[i])) {
      hr_count++;
    }
  }
  var current_top = $('#js-markdown-result').scrollTop();
  var pos = $($('#js-markdown-result').find('hr')[hr_count]).position()
  $('#js-markdown-result').scrollTop(current_top + pos.top);
}

function adjust_reveal_slide() {
  var cursorPosition = editor.getCursorPosition();
  var editorDocument = editor.getSession().getDocument();
  var upper_lines = editorDocument.getLines(0, cursorPosition.row);
  var distIndexX = 0;
  var distIndexY = 0;
  var last_chapter_separator_row = 0;
  for( var i = 0; i < upper_lines.length; i++ ) {
    if( is_chapter_separator(upper_lines[i]) ) {
      distIndexX++;
      last_chapter_separator_row = i;
    }
  }
  for( var i = last_chapter_separator_row; i < upper_lines.length; i++ ) {
    if( is_section_separator(upper_lines[i]) ) {
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

