let $ = require('jquery');  // jQuery now loaded and assigned to $// enable everything
var marked = require('marked');

$('#js-markdown-input').on('change', function() {
  var input_markdown = $('#js-markdown-input').val();
  var result_html = marked(input_markdown);
  $('#js-markdown-result').html(result_html);
});
