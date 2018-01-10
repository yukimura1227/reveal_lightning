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
  settings.set('target_md', { file_path: __dirname + '/sample.md' });
  if(!settings.has('server.port')) {
    settings.set('server', { port: '8000' });
  }
  settings.set('url', {
    presentation: 'http://localhost:' + settings.get('server.port') + '/reveal_view.html',
    print: settings.get('url.presentation') + '?print-pdf'
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
