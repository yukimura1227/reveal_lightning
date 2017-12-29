"use strict";
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const NodeStatic = require('node-static');
const path = require('path')
const url  = require('url')
global.target_port = '8000';
let mainWindow;

var file = new NodeStatic.Server(__dirname + '/');

require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response);
  }).resume();
}).listen(global.target_port);//ポートは空いていそうなところで。


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
