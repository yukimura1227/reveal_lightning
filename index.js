"use strict";
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const NodeStatic = require('node-static');
let mainWindow;

var file = new NodeStatic.Server(__dirname + '/');

require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response);
  }).resume();
}).listen(8000);//ポートは空いていそうなところで。


app.on('window-all-closed', () => app.quit());
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 600
  });

  //ローカルで立てたサーバーにアクセス
  mainWindow.loadURL('http://localhost:8000/index.html');
  mainWindow.webContents.openDevTools()

  // ウィンドウが閉じられたらアプリも終了
  mainWindow.on('closed', () => mainWindow = null );
});
