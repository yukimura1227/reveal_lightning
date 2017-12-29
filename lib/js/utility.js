function read_file(target_filepath) {
  let data = fs.readFileSync(target_filepath, 'utf8');
  editor.setValue(data);
}

function write_file(target_filepath) {
  fs.writeFile(target_filepath, editor.getValue(), function (error) {});
}
