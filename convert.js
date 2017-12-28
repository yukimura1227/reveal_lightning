const $ = require('jquery');  // jQuery now loaded and assigned to $// enable everything
const marked = require('marked');
const fs = require('fs');
const target_md_file = 'sample.md';

require('ace-min-noconflict');
require('ace-min-noconflict/mode-markdown');

var editor;
window.addEventListener('DOMContentLoaded',function() {
  editor = ace.edit("js-markdown-input");
  editor.getSession().setMode('ace/mode/markdown');
  editor.$blockScrolling = Infinity; // ワーニングに対処
  if(process.platform == 'darwin') { // Ctrl+Pが効かない問題に対処
    editor.commands.bindKey("Ctrl-P", "golineup");
  }
  editor.getSession().on('change', function() {
    compile_and_display_markdown();
    write_file(target_md_file);
  });
  initialize_load();
});

function compile_and_display_markdown() {
  let input_markdown = editor.getValue();
  let result_html = marked(input_markdown);
  $('#js-markdown-result').html(result_html);
}

function initialize_load() {
  read_file(target_md_file);
  compile_and_display_markdown();
}

function read_file(target_filepath) {
  let data = fs.readFileSync(target_filepath, 'utf8');
  editor.setValue(data);
}

function write_file(target_filepath) {
  fs.writeFile(target_filepath, editor.getValue());
}
