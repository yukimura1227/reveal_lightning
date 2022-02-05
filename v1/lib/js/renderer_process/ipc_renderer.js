const electron = require('electron');
const {ipcRenderer} = electron;
import {open_preference_dialog} from './tools.js';
import {open_load_file_dialog}  from './tools.js';
import {open_progress_dialog}   from './tools.js';
import {open_new_file_dialog}   from './tools.js';

// 非同期でメインプロセスからのメッセージを受信する
ipcRenderer.on('message', function(args, message) {
  alert(message);
});

ipcRenderer.on('show-progress-dialog', function(args, message) {
  alert(message);
  open_progress_dialog();
});

ipcRenderer.on('update-progress-dialog', function(args, percent) {
  update_progress_dialog(percent);
});

ipcRenderer.on('open-preference-dialog', function(args) {
  open_preference_dialog();
});

ipcRenderer.on('open-new-file-dialog', function(args) {
  open_new_file_dialog();
});

ipcRenderer.on('open-load-file-dialog', function(args) {
  open_load_file_dialog();
});

ipcRenderer.on('grid-template', function(args) {
  $('#js-grid-template-btn').trigger('click');
});

ipcRenderer.on('image-paste', function(args) {
  $('#js-image-paste-btn').trigger('click');
});

ipcRenderer.on('add-chapter-separator', function(args) {
  $('#js-chapter-separate-btn').trigger('click');
});

ipcRenderer.on('add-section-separator', function(args) {
  $('#js-section-separate-btn').trigger('click');
});

ipcRenderer.on('reload-reveal-area', function(args) {
  $('#js-reload-reveal-view-btn').trigger('click');
});

ipcRenderer.on('start-server-reply', function(args) {
  alert('success restart server');
});

function call_start_server() {
  ipcRenderer.send('start-server', 'port changed');
}
