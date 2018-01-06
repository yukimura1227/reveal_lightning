"use strict";
const electron        = require("electron");
const {app, BrowserWindow, Menu, ipcMain} = electron;

const NodeStatic = require('node-static');
const path = require('path')
const url  = require('url')
const http = require('http');

const settings = require('electron-settings');

const application_menu = require('./lib/js/main_process/application-menu')

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
  start_server(settings.get('server.port'));
});

var file = new NodeStatic.Server(__dirname + '/');

function start_server(target_port) {
  if( global.http_server != undefined && global.http_server != null) {
    global.http_server.close( function() {
      console.log('server is closed!!');
    });
  }
  global.http_server = http.createServer(function (request, response) {
    request.addListener('end', function () {
      file.serve(request, response);
    }).resume();
  });
  global.http_server.listen(target_port);
}

ipcMain.on('start-server', (event, arg) => {
  start_server(settings.get('server.port'));
  event.sender.send('start-server-reply');
});

app.on('window-all-closed', () => app.quit());
app.on('activate', () => {
  const menu = Menu.buildFromTemplate(application_menu.menu_template);
  Menu.setApplicationMenu(menu);

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
});
