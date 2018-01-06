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
        {
          label: 'redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: 'copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'toggle full screen',
          accelerator: (function() {
            if (process.platform === 'darwin') {
              return 'Ctrl+Command+F'
            } else {
              return 'F11'
            }
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
            }
          }
        }
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
