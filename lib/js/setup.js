const $ = require('jquery');  // jQuery now loaded and assigned to $// enable everything
const marked = require('marked');
const fs = require('fs');
const clipboard = require('electron').clipboard;
const remote = require('electron').remote;
const shell = require('electron').shell;
const settings = require('electron-settings');
const presentation_url = 'http://localhost:' + settings.get('server.port') + '/reveal_view.html';
const print_url        = presentation_url + '?print-pdf';

require('ace-min-noconflict');
require('ace-min-noconflict/mode-markdown');

const menu = new remote.Menu();
window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  menu.popup(remote.getCurrentWindow());
}, false);

