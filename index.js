"use strict";
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const NodeStatic = require('node-static');
const path = require('path')
const url  = require('url')

const settings = require('electron-settings');
app.on('ready', () => {
  settings.set('target_md', { file_path: __dirname + '/sample.md' });
  settings.set('server', { port: '8000' });// ポートは空いていそうなところで。
  settings.set('url', { presentation: 'http://localhost:' + settings.get('server.port') + '/reveal_view.html' });// ポートは空いていそうなところで。
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
