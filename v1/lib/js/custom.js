md_section = document.getElementById('js-markdown-section');
$.getJSON("load_target.json" , function(data) {
  md_section.setAttribute('data-markdown', data.load_target);
});

theme_link = document.getElementById('js-reveal-theme-css');
$.getJSON("theme.json" , function(data) {
  theme_link.setAttribute('href', data.theme_css_path);
});
