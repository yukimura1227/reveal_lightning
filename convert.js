const $ = require('jquery');  // jQuery now loaded and assigned to $// enable everything
const marked = require('marked');
const fs = require('fs');
const target_md_file = 'sample.md';
const clipboard = require('electron').clipboard

$('#js-markdown-input').on('change', function() {
  compile_and_display_markdown();
  write_file(target_md_file);
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
      var input_area = $('#js-markdown-input');
      input_area.val(input_area.val() + "![](" + image_file_name + ")\n");
      $('#js-markdown-input').trigger('change');
    },
    500
  );
});


function compile_and_display_markdown() {
  let input_markdown = $('#js-markdown-input').val();
  let result_html = marked(input_markdown);
  $('#js-markdown-result').html(result_html);
}

function initialize_load() {
  read_file(target_md_file);
  compile_and_display_markdown();
}

function read_file(target_filepath) {
  let data = fs.readFileSync(target_filepath, 'utf8');
  $('#js-markdown-input').val(data);
}

function write_file(target_filepath) {
  fs.writeFile(target_filepath, $('#js-markdown-input').val());
}

initialize_load();
