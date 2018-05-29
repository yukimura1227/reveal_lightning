const marked   = require('marked');
const settings = require('electron-settings');
import {read_file, write_file} from './utility.js';

export var editor;
window.addEventListener('DOMContentLoaded',function() {
  var renderer = new marked.Renderer();
  renderer.code = function(code, language) {
    return '<pre><code class="hljs">' + require('highlight.js').highlightAuto(code).value + '</code></pre>';
  };
  marked.setOptions({
    renderer: renderer,
  });

  editor = ace.edit("js-markdown-input");
  editor.setTheme('ace/theme/' + settings.get('editor.theme'));
  editor.getSession().setMode('ace/mode/markdown');
  editor.setKeyboardHandler( 'ace/keyboard/' + settings.get('keybinding.handler') );
  editor.setOptions({
    enableBasicAutocompletion: false,
    enableSnippets: false,
    enableLiveAutocompletion: false
  });

  load_markdown_file();

  editor.$blockScrolling = Infinity; // ワーニングに対処
  if(process.platform == 'darwin') { // Ctrl+Pが効かない問題に対処
    editor.commands.bindKey("Ctrl-P", "golineup");
  }
  editor.getSession().getDocument().on('change', function() {
    compile_and_display_markdown();
    adjust_markdown_preview_scroll();
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
  var editor_doc = editor.getSession().getDocument();
  var cursor_pos = editor.getCursorPosition();
  return editor_doc.getLines(cursor_pos.row, cursor_pos.row)[0];
}

function get_upper_lines() {
  var editor_doc = editor.getSession().getDocument();
  var cursor_pos = editor.getCursorPosition();
  var upper_lines = editor_doc.getLines(0, cursor_pos.row);
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

function is_heading(str) {
  return /^#{1,6}[ \t]+.+$/.test(str);
}

function is_heading_n(n, str) {
  var heading_n_matcher = new RegExp("^#{" + n + "}[ \\t]+.+$", 'i');
  return heading_n_matcher.test(str);
}

function adjust_markdown_preview_scroll() {
  var current_line = get_current_line();
  if (is_separator(current_line)) {
    adjust_markdown_preview_scroll_by_separator();
  }
  if (is_heading(current_line)) {
    adjust_markdown_preview_scroll_by_heading();
  }
}

function adjust_markdown_preview_scroll_by_separator() {
  var upper_lines = get_upper_lines();
  var hr_count = -1;
  for( var i = 0; i < upper_lines.length; i++ ) {
    if( is_separator(upper_lines[i])) {
      hr_count++;
    }
  }
  var current_top = $('#js-markdown-result').scrollTop();
  var pos = $($('#js-markdown-result').find('hr')[hr_count]).position();
  $('#js-markdown-result').scrollTop(current_top + pos.top);
}

function adjust_markdown_preview_scroll_by_heading() {
  var current_line = get_current_line();
  var upper_lines = get_upper_lines();
  var sharps = current_line.split(/\s/)[0]; // extract sharps from markdown heading sentence( ex) ### hoge -> ###)
  var heading_n = sharps.match(/#/g).length;

  var heading_n_count = -1;
  for( var i = 0; i < upper_lines.length; i++ ) {
    if( is_heading_n(heading_n, upper_lines[i]) ) {
      heading_n_count++;
    }
  }
  var current_top = $('#js-markdown-result').scrollTop();
  var target_el_name = 'h' + heading_n;
  var target_el      = $('#js-markdown-result').find(target_el_name)[heading_n_count];
  if( target_el != undefined ) {
    var pos = $(target_el).position();
    $('#js-markdown-result').scrollTop(current_top + pos.top);
  }
}

function adjust_reveal_slide() {
  var cursor_pos = editor.getCursorPosition();
  var editor_doc = editor.getSession().getDocument();
  var upper_lines = editor_doc.getLines(0, cursor_pos.row);
  var dist_index_x = 0;
  var dist_index_y = 0;
  var last_chapter_separator_row = 0;
  for( var i = 0; i < upper_lines.length; i++ ) {
    if( is_chapter_separator(upper_lines[i]) ) {
      dist_index_x++;
      last_chapter_separator_row = i;
    }
  }
  for( var i = last_chapter_separator_row; i < upper_lines.length; i++ ) {
    if( is_section_separator(upper_lines[i]) ) {
      dist_index_y++;
    }
  }

  if($('#js-reveal-view')[0].contentWindow.Reveal != undefined) {
    $('#js-reveal-view')[0].contentWindow.Reveal.slide(dist_index_x, dist_index_y);
  }
}

function compile_and_display_markdown() {
  let input_markdown = editor.getValue();
  let result_html = marked(input_markdown);
  $('#js-markdown-result').html(result_html);
}

export function load_markdown_file() {
  var text = read_file(settings.get('target_md.file_path'));
  editor.setValue(text);
  editor.gotoLine(0,0);
  compile_and_display_markdown();
}

