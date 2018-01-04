'use strict';
const {app} = require("electron");

module.exports.menu_template = function() {
  var menu_template = [
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

  if (process.platform === 'darwin') {
    const name = app.getName()
    menu_template.unshift({
      label: name,
      submenu: [
        {
          label: `About ${name}`,
          role: 'about'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() {
            app.quit()
          }
        }
      ]
    });
  }
  return menu_template;
}();
