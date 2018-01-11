"use strict";
const electron        = require("electron");
const {app, BrowserWindow, Menu} = electron;

const path = require('path');
const url  = require('url');

const settings = require('electron-settings');

const application_menu = require('./lib/js/main_process/application-menu');
const ipc_main = require('./lib/js/main_process/ipc_main');

global.mainWindow = null;

app.on('ready', () => {
  if(!settings.has('target_md.file_path')) {
    var workdir = __dirname;
    var file_path = __dirname + '/sample.md';
    settings.set('target_md', {
      workdir: workdir,
      file_path: file_path,
    });
  }
  if(!settings.has('server.port')) {
    settings.set('server', { port: '8000' });
  }
  var presentation_url = 'http://localhost:' + settings.get('server.port') + '/reveal_view.html';
  var print_url = presentation_url + '?print-pdf'
  settings.set('url', {
    presentation: presentation_url,
    print: print_url
  });
  ipc_main.start_server(settings.get('server.port'));
  if(global.mainWindow === null ) {
    createWindow();
  }
  const menu = Menu.buildFromTemplate(application_menu.menu_template);
  Menu.setApplicationMenu(menu);
});

app.on('window-all-closed', () => {
  electron.session.defaultSession.clearCache(() => {});
  app.quit();
});
app.on('activate', () => {
  if(global.mainWindow === null ) {
    createWindow();
  }
});
function createWindow() {
  global.mainWindow = new BrowserWindow({width: 960, height: 600});

  //ローカルで立てたサーバーにアクセス
  global.mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/index.html'),
    protocol: 'file:',
    slashes: true
  }));
  // global.mainWindow.webContents.openDevTools();

  // ウィンドウが閉じられたらアプリも終了
  global.mainWindow.on('closed', () => global.mainWindow = null );
}
