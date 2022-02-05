"use strict";
const electron        = require("electron");
const {app, BrowserWindow, Menu} = electron;

const path       = require('path');
const url        = require('url');
const fs         = require('fs');
const fse        = require('fs-extra')
const parse_path = require('parse-filepath');

const settings        = require('electron-settings');
const { autoUpdater } = require('electron-updater')
const log             = require('electron-log');

const application_menu = require('./lib/js/main_process/application-menu');
const ipc_main = require('./lib/js/main_process/ipc_main');

global.mainWindow = null;
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
  setup_application_common_setting();
  setup_server_root(settings.get('app.server_root'));
  setup_export_to();
  setup_user_work_dir();
  setup_target_markdown_path();
  setup_server_url();
  setup_editor_theme();
  setup_editor_keybinding();
  ipc_main.start_server(settings.get('server.port'));
  createWindow();
  const menu = Menu.buildFromTemplate(application_menu.menu_template);
  Menu.setApplicationMenu(menu);
});

function sendStatusToWindow(text) {
  log.info(text);
  global.mainWindow.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  var text = 'Found New Version. Now Downloading...';
  global.mainWindow.webContents.send('show-progress-dialog', text);
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available.');
});

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  log.info(log_message);
  global.mainWindow.webContents.send('update-progress-dialog', progressObj.percent);
});

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('New Version Downloaded!!');
  autoUpdater.quitAndInstall();
});

function setup_export_to() {
  if(!settings.has('export.to')) {
    settings.set('export', { to: app.getPath('userData') + '/default_exports'});
  }
  if(!settings.has('export_dir_history.data')) {
    settings.set('export_dir_history', { data: [settings.get('export.to')] });
  }
}

function is_first_setup() {
  return !settings.has('target_md.file_path');
}

function setup_target_markdown_path() {
  if(is_first_setup()) {
    var original_work_dir = settings.get('app.root_dir') + '/work';
    var copy_to_work_dir  = app.getPath('userData') + '/work';
    var link_from         = settings.get('app.server_root') + '/work';
    console.log(original_work_dir);
    console.log(copy_to_work_dir);
    fse.copySync(original_work_dir, copy_to_work_dir);
    if(fs.existsSync(link_from) ) {
      fs.unlinkSync(link_from);
    }
    fs.symlinkSync(copy_to_work_dir, link_from, 'junction');
    var default_file_name  = 'sample.md';
    var file_relative_dir  = settings.get('env.work_dir_name') + '/sample';
    var file_relative_path = file_relative_dir + '/' + default_file_name;
    var file_dir           = settings.get('env.work_dir') + '/sample';
    var file_path          = file_dir + '/' + default_file_name;
    settings.set('target_md', {
      file_dir: file_dir,
      file_path: file_path,
      file_relative_dir: file_relative_dir,
      file_relative_path: file_relative_path
    });
    fs.writeFileSync(settings.get('app.config_file.load_target'), '{ "load_target": "' + file_relative_path + '" }');
    fs.writeFileSync(settings.get('app.config_file.theme'), '{ "theme_css_path": "node_modules/reveal.js/css/theme/black.css", "theme_css_filename": "black.css" }');
  }
}

function setup_application_common_setting() {
  var app_root_dir = __dirname;
  var server_root  = app.getPath('userData') + '/www';
  settings.set('app', {
    root_dir: app_root_dir,
    server_root: server_root,
    config_file: {
      load_target: server_root + '/load_target.json',
      theme: server_root + '/theme.json'
    }
  });
}

function setup_server_url() {
  if(!settings.has('server.port')) {
    settings.set('server', { port: '8000' });
  }
  var presentation_url = 'http://localhost:' + settings.get('server.port') + '/reveal_view.html';
  var print_url = presentation_url + '?print-pdf'
  settings.set('url', {
    presentation: presentation_url,
    print: print_url
  });
}

function setup_server_root(server_root) {
  if(!fs.existsSync(server_root)) {
    fs.mkdirSync(server_root);
  }
  var copy_targets = ['index.html', 'reveal_view.html', 'load_target.json', 'theme.json'];
  for( var i = 0; i < copy_targets.length; i++ ) {
    var copy_from = settings.get('app.root_dir') + '/' + copy_targets[i];
    var copy_dist = server_root + '/' + copy_targets[i];
    if(!fs.existsSync(copy_dist) || copy_targets[i] == 'index.html' ) {
      fse.copySync(copy_from, copy_dist);
    }
  }
  // fse.copy(settings.get('app.root_dir') + '/node_modules/ace-min-noconflict/', server_root + '/', {
  //   filter: function(path){
  //     // allow copy target directory
  //     if(path.match(/node_modules\/ace-min-noconflict$/)) {
  //       return true
  //     }
  //     if( path.match(/node_modules\/ace-min-noconflict\/(theme-|ext-|keybinding-).*\.js/)) {
  //       return true;
  //     }
  //     return false;
  //   }
  // });

  // NOTE: allow directory only cause cannot symlink on windows in default permission
  var link_targets = ['node_modules', 'lib', 'readme_resource'];
  for( var i = 0; i < link_targets.length; i++ ) {
    var link_dist = settings.get('app.root_dir') + '/' + link_targets[i];
    var link_from = server_root + '/' + link_targets[i];
    if(fs.existsSync(link_from) ) {
      fs.unlinkSync(link_from);
    }
    fs.symlinkSync(link_dist, link_from, 'junction');
  }
}

function setup_user_work_dir() {
  if(!settings.has('env.work_dir')) {
    var default_work_dir_name = 'work';
    settings.set('env', {
      work_dir: settings.get('app.server_root') + '/' + default_work_dir_name,
      work_dir_name: default_work_dir_name
    });
  }
  if(!settings.has('work_dir_history.data')) {
    settings.set('work_dir_history', { data: [settings.get('env.work_dir')] });
  }
}

function setup_editor_theme() {
  if(!settings.has('editor.theme')) {
    settings.set('editor', { theme: 'twilight' });
  }
}

function setup_editor_keybinding() {
  if(!settings.has('keybinding.handler')) {
    settings.set('keybinding', { handler: 'ace' });
  }
}

app.on('window-all-closed', () => {
  electron.session.defaultSession.clearCache(() => {});
  app.quit();
});

app.on('activate', () => {
  createWindow();
});

function createWindow() {
  if(global.mainWindow !== null ) {
    return;
  }
  global.mainWindow = new BrowserWindow({width: 960, height: 600});

  global.mainWindow.loadURL(url.format({
    pathname: path.join('localhost:' + settings.get('server.port'), 'index.html'),
    protocol: 'http:',
    slashes: true
  }));
  global.mainWindow.webContents.session.clearCache(function() {});

  // global.mainWindow.webContents.openDevTools();

  // ウィンドウが閉じられたらアプリも終了
  global.mainWindow.on('closed', () => global.mainWindow = null );
}
