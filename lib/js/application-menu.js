'use strict';
const {app} = require("electron");

module.exports.menu_template = function() {
  var menu_template = [
    {
      label: app.getName(),
      submenu: [
        {
          label: `About ${app.getName()}`,
          role: 'about'
        },
        {
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
        }
      ]
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
}();
