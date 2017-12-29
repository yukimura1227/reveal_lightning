const $ = require('jquery');  // jQuery now loaded and assigned to $// enable everything
const marked = require('marked');
const fs = require('fs');
const target_md_file = 'sample.md';
const clipboard = require('electron').clipboard

require('ace-min-noconflict');
require('ace-min-noconflict/mode-markdown');
