'use strict';
const {app} = require("electron");

module.exports.menu_template = generate_mnue_template();

function generate_mnue_template() {
  var menu_template = [
    {
      label: app.getName(),
      submenu: generate_submenu_for_appmenu()
    },
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role: 'selectall'}
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    },
    {
      role: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'close'}
      ]
    }
  ];
  return menu_template;
}

function generate_submenu_for_appmenu() {
  var submenu_for_appmenu = [];
  if (process.platform === 'darwin') {
    submenu_for_appmenu.push({
      label: `About ${app.getName()}`,
      role: 'about'
    });
  }
  submenu_for_appmenu.push({
    label: 'Preferences',
    accelerator: 'Command+,',
    click: function() {
      global.mainWindow.webContents.send('open-preference-dialog');
    }
  });
  submenu_for_appmenu.push({
    label: 'Quit',
    accelerator: (function() {
      if (process.platform === 'darwin') {
        return 'Command+Q';
      } else {
        return 'Alt+F4';
      }
    })(),
    click: function() {
      app.quit();
    }
  });
  return submenu_for_appmenu;
}
