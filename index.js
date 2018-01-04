"use strict";
const electron        = require("electron");
const {app}           = electron;
const {BrowserWindow} = electron;
const {Menu}          = electron;

const NodeStatic = require('node-static');
const path = require('path')
const url  = require('url')

const settings = require('electron-settings');

const application_menu = require('./lib/js/application-menu')

app.on('ready', () => {
  settings.set('target_md', { file_path: __dirname + '/sample.md' });
  if(!settings.has('server.port')) {
    settings.set('server', { port: '8000' });// ポートは空いていそうなところで。
  }
  settings.set('url', {
    presentation: 'http://localhost:' + settings.get('server.port') + '/reveal_view.html',
    print: settings.get('url.presentation') + '?print-pdf'
  });// ポートは空いていそうなところで。
});

let mainWindow;

var file = new NodeStatic.Server(__dirname + '/');

require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response);
  }).resume();
}).listen(settings.get('server.port'));


app.on('window-all-closed', () => app.quit());
app.on('activate', () => {
  const menu = Menu.buildFromTemplate(application_menu.menu_template);
  Menu.setApplicationMenu(menu);

  mainWindow = new BrowserWindow({width: 960, height: 600});

  //ローカルで立てたサーバーにアクセス
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/index.html'),
    protocol: 'file:',
    slashes: true
  }));
  // mainWindow.webContents.openDevTools();

  // ウィンドウが閉じられたらアプリも終了
  mainWindow.on('closed', () => mainWindow = null );
});
