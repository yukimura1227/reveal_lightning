'use strict';
const {app} = require("electron");

module.exports.menu_template = generate_menu_template();

function generate_menu_template() {
  var menu_template = [
    {
      label: app.getName(),
      submenu: generate_submenu_for_appmenu()
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CommandOrControl+N',
          click: function() {
            global.mainWindow.webContents.send('open-new-file-dialog');
          }
        },
        {
          label: 'Open',
          accelerator: 'CommandOrControl+O',
          click: function() {
            global.mainWindow.webContents.send('open-load-file-dialog');
          }
        }
      ]
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
        {

          label: 'Paste Image',
          accelerator: 'CommandOrControl+Alt+V',
          click: function() {
            global.mainWindow.webContents.send('image-paste');
          }
        },
        {role: 'delete'},
        {role: 'selectall'}
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CommandOrControl+R',
          click: function() {
            global.mainWindow.webContents.send('reload-reveal-area');
          }
        },
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
