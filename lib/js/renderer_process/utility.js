const fs = require('fs');

export function read_file(target_filepath) {
  let data = fs.readFileSync(target_filepath, 'utf8');
  return data;
}

export function write_file(target_filepath) {
  var editor = RevealLightning.markdown_support.get_editor();
  fs.writeFile(target_filepath, editor.getValue(), function (error) {});
}

export function put2editor(str) {
  var editor = RevealLightning.markdown_support.get_editor();
  editor.session.insert(editor.getCursorPosition(), str);
  editor.focus();
}
