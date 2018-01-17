"use strict";
const electron        = require("electron");
const {app, BrowserWindow, Menu} = electron;

const path       = require('path');
const url        = require('url');
const fs         = require('fs');
const parse_path = require('parse-filepath');

const settings = require('electron-settings');

const application_menu = require('./lib/js/main_process/application-menu');
const ipc_main = require('./lib/js/main_process/ipc_main');

global.mainWindow = null;

app.on('ready', () => {
  settings.set('app', { root_dir: __dirname , server_root: app.getPath('userData') + '/www'});
  var server_root = settings.get('app.server_root');
  if(!fs.existsSync(server_root)) {
    fs.mkdirSync(server_root);
    fs.symlinkSync(settings.get('app.root_dir') + '/index.html'      , server_root + '/index.html');
    fs.symlinkSync(settings.get('app.root_dir') + '/reveal_view.html', server_root + '/reveal_view.html');
    fs.symlinkSync(settings.get('app.root_dir') + '/load_target.json', server_root + '/load_target.json');
    fs.symlinkSync(settings.get('app.root_dir') + '/theme.json'      , server_root + '/theme.json');
    fs.symlinkSync(settings.get('app.root_dir') + '/node_modules'    , server_root + '/node_modules');
    fs.symlinkSync(settings.get('app.root_dir') + '/lib'             , server_root + '/lib');
    fs.symlinkSync(settings.get('app.root_dir') + '/readme_resource' , server_root + '/readme_resource');
    fs.symlinkSync(settings.get('app.root_dir') + '/work'            , server_root + '/work');
  }
  if(!settings.has('env.work_dir')) {
    var work_dir_name = 'work';
    settings.set('env', { work_dir: __dirname + '/' + work_dir_name, work_dir_name: work_dir_name });
  }
  if(!settings.has('target_md.file_path')) {
    var file_name          = 'sample.md';
    var work_dir_name      = parse_path(settings.get('env.work_dir')).basename;
    var file_relative_dir  = work_dir_name + '/sample';
    var file_relative_path = file_relative_dir + '/' + file_name;
    var file_dir  = settings.get('env.work_dir') + '/sample';
    var file_path = file_dir + '/sample.md';
    settings.set('target_md', { file_dir: file_dir, file_path: file_path, file_relative_dir: file_relative_dir });
    fs.writeFileSync(settings.get('app.root_dir') + '/load_target.json', '{ "load_target": "' + file_relative_path + '" }');
    fs.writeFileSync(settings.get('app.root_dir') + '/theme.json', '{ "theme_css_path": "node_modules/reveal.js/css/theme/black.css", "theme_css_filename": "black.css" }');
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

  global.mainWindow.loadURL(url.format({
    pathname: path.join(settings.get('app.server_root'), '/index.html'),
    protocol: 'file:',
    slashes: true
  }));
  // global.mainWindow.webContents.openDevTools();

  // ウィンドウが閉じられたらアプリも終了
  global.mainWindow.on('closed', () => global.mainWindow = null );
}
