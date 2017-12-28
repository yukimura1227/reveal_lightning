let $ = require('jquery');  // jQuery now loaded and assigned to $// enable everything
var marked = require('marked');
let fs = require('fs');

$('#js-markdown-input').on('change', function() {
  var input_markdown = $('#js-markdown-input').val();
  var result_html = marked(input_markdown);
  $('#js-markdown-result').html(result_html);

  fs.writeFile('sample.md', $('#js-markdown-input').val());

});

function initialize_load() {
  let data = fs.readFileSync('sample.md', 'utf8');
  $('#js-markdown-input').val(data);
}

initialize_load();
