const $ = require('jquery');  // jQuery now loaded and assigned to $// enable everything
const marked = require('marked');
const fs = require('fs');

$('#js-markdown-input').on('change', function() {
  let input_markdown = $('#js-markdown-input').val();
  let result_html = marked(input_markdown);
  $('#js-markdown-result').html(result_html);

  write_file('sample.md')

});

function initialize_load() {
  read_file('sample.md');
}

function read_file(target_filepath) {
  let data = fs.readFileSync(target_filepath, 'utf8');
  $('#js-markdown-input').val(data);
}

function write_file(target_filepath) {
  fs.writeFile('sample.md', $('#js-markdown-input').val());
}

initialize_load();