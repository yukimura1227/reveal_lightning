const $      = require('jquery');  // jQuery now loaded and assigned to $// enable everything
const fs     = require('fs');
const parse_path = require('parse-filepath');

const electron = require('electron');
const {remote} = electron;

const settings = require('electron-settings');

var ace = require('brace');
require('brace/mode/markdown');
var themeList = fs.readdirSync(settings.get('app.root_dir') + '/node_modules/brace/theme');
for (var i = 0; i < themeList.length; i++) {
  if( themeList[i].match(/.*\.js/)) {
    var theme_name = themeList[i].match(/(.*)\.js/)[1];
    require('brace/theme/' + theme_name);
  }
}
var keybindingList = fs.readdirSync(settings.get('app.root_dir') + '/node_modules/brace/keybinding');
for (var i = 0; i < keybindingList.length; i++) {
  if( keybindingList[i].match(/.*\.js/)) {
    var keybind_name = keybindingList[i].match(/(.*)\.js/)[1];
    require('brace/keybinding/' + keybind_name);
  }
}
var extensionList = fs.readdirSync(settings.get('app.root_dir') + '/node_modules/brace/ext');
for (var i = 0; i < extensionList.length; i++) {
  if( extensionList[i].match(/.*\.js/)) {
    var extension_name = extensionList[i].match(/(.*)\.js/)[1];
    require('brace/ext/' + extension_name);
  }
}
const menu = new remote.Menu();
window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  menu.popup(remote.getCurrentWindow());
}, false);

window.addEventListener('DOMContentLoaded',function() {
  $('#js-reveal-view')[0].contentDocument.location.replace(settings.get('url.presentation'));
}, false);
