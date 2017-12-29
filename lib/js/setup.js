const $ = require('jquery');  // jQuery now loaded and assigned to $// enable everything
const marked = require('marked');
const fs = require('fs');
const target_md_filepath = __dirname + '/sample.md';
const clipboard = require('electron').clipboard;
const remote = require('electron').remote;
const shell = require('electron').shell;
const target_port = remote.getGlobal('target_port');
const presentation_url = 'http://localhost:' + target_port + '/reveal_view.html';

require('ace-min-noconflict');
require('ace-min-noconflict/mode-markdown');
