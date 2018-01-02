const $ = require('jquery');  // jQuery now loaded and assigned to $// enable everything
const marked = require('marked');
const fs = require('fs');
const {clipboard} = require('electron');
const {remote} = require('electron');
const {shell} = require('electron');
const settings = require('electron-settings');

require('ace-min-noconflict');
require('ace-min-noconflict/mode-markdown');

const menu = new remote.Menu();
window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  menu.popup(remote.getCurrentWindow());
}, false);

