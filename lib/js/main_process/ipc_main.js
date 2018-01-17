"use strict";
const electron  = require("electron");
const {app, ipcMain} = electron;
const settings  = require('electron-settings');

const NodeStatic = require('node-static');
const http = require('http');
const fs   = require('fs');

ipcMain.on('start-server', (event, arg) => {
  start_server(settings.get('server.port'));
  event.sender.send('start-server-reply');
});

function setup_server_env() {
  var server_root = settings.get('app.server_root');
  var file = new NodeStatic.Server(server_root);
  return file;
}

module.exports.start_server = start_server;
function start_server(target_port) {
  if( global.http_server != undefined && global.http_server != null) {
    global.http_server.close( function() {
      console.log('server is closed!!');
    });
  }
  global.http_server = http.createServer(function (request, response) {
    request.addListener('end', function () {
      setup_server_env().serve(request, response);
    }).resume();
  });
  global.http_server.listen(target_port);
}

