const $      = require('jquery');  // jQuery now loaded and assigned to $// enable everything
const marked = require('marked');
const fs     = require('fs');
const fse    = require('fs-extra')
const parse_path = require('parse-filepath');

const electron = require('electron');
const {clipboard, remote, shell, ipcRenderer}   = electron;
const {MenuItem, dialog} = remote

const settings = require('electron-settings');

require('ace-min-noconflict');
require('ace-min-noconflict/mode-markdown');

const menu = new remote.Menu();
window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  menu.popup(remote.getCurrentWindow());
}, false);

