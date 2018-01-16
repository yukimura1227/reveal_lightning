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

// var file = new NodeStatic.Server(__dirname + '/../../../');
var server_root = app.getPath('userData') + '/www';
if(!fs.existsSync(server_root)) {
  fs.mkdirSync(server_root);
  fs.symlinkSync(settings.get('app.root_dir') + '/reveal_view.html', server_root + '/reveal_view.html');
  fs.symlinkSync(settings.get('app.root_dir') + '/load_target.json', server_root + '/load_target.json');
  fs.symlinkSync(settings.get('app.root_dir') + '/theme.json', server_root + '/theme.json');
  fs.symlinkSync(settings.get('app.root_dir') + '/node_modules', server_root + '/node_modules');
  fs.symlinkSync(settings.get('app.root_dir') + '/lib', server_root + '/lib');
  fs.symlinkSync(settings.get('app.root_dir') + '/readme_resource', server_root + '/readme_resource');
  fs.symlinkSync(settings.get('app.root_dir') + '/work', server_root + '/work');
}
var file = new NodeStatic.Server(server_root);

module.exports.start_server = start_server;
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

