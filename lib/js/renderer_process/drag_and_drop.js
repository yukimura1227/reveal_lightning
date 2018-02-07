"use strict";

document.ondragover = document.ondrop = function (e) {
  e.preventDefault();
}
document.body.addEventListener('drop', function (e) {
  console.log('file dropped:', e.dataTransfer.files[0]);
  var file_obj = e.dataTransfer.files[0];
  var image_file_name = file_obj.name;
  var copy_to_path = settings.get('target_md.file_dir') + '/' + file_obj.name;
  var reference_path = settings.get('target_md.file_relative_dir') + '/' + file_obj.name;
  var original_file_path = file_obj.path;
  if(fs.existsSync(copy_to_path)) {
    if( confirm('file already exists! over write?') ) {
    } else {
      return;
    }
  }
  fse.copy(original_file_path, copy_to_path);
  put2editor("![](" + reference_path + ")\n");
});
