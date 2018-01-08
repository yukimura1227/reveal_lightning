md_section = document.getElementById('js-markdown-section');
$.getJSON("load_target.json" , function(data) {
  md_section.setAttribute('data-markdown', data.load_target);
});
