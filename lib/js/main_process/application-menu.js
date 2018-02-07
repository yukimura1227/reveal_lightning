'use strict';
const {app}      = require("electron");
const fse        = require('fs-extra')
const settings   = require('electron-settings');
const replace    = require('replace-in-file');
const parse_path = require('parse-filepath');

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
        },
        {
          label: 'Export',
          accelerator: 'CommandOrControl+Shift+E',
          click: function() {
            export_files();
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
        {role: 'selectall'},
        {type: 'separator'},
        {
          label: 'add chapter separator',
          accelerator: 'CommandOrControl+}',
          click: function() {
            global.mainWindow.webContents.send('add-chapter-separator');
          }
        },
        {
          label: 'add section separator',
          accelerator: 'CommandOrControl+]',
          click: function() {
            global.mainWindow.webContents.send('add-section-separator');
          }
        }
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

function export_files() {
  var modules_export_to_dir = settings.get('export.to')
  copy_dependent_nodemodules(modules_export_to_dir);
  var export_to_dir = settings.get('export.to') + '/' + parse_path(settings.get('target_md.file_relative_dir')).basename
  fse.copySync(server_root() + '/reveal_view.html', export_to_dir + '/index.html', { dereference: true });
  replace.sync({
    files: export_to_dir + '/index.html',
    from: /\/node_modules/g,
    to: '../node_modules'
  });

  var targets = ['load_target.json', 'theme.json', 'lib/css/custom.css', 'lib/js/renderer_process/custom.js'];
  for( var i = 0; i < targets.length; i++ ) {
    fse.copySync(server_root() + '/' + targets[i], export_to_dir + '/' + targets[i], { dereference: true });
  }
  replace.sync({
    files: export_to_dir + '/theme.json',
    from: /node_modules/g,
    to: '../node_modules'
  });
  var markdown_from = server_root() + '/' + settings.get('target_md.file_relative_dir');
  var markdown_to   = export_to_dir + '/' + settings.get('target_md.file_relative_dir');
  fse.copySync(markdown_from, markdown_to);
}

function server_root() {
  return settings.get('app.server_root');
}

function create_empty_file(file_path) {
  fse.open(file_path, "wx", function (err, fd) {
    fse.close(fd, function (err) { });
  });
}

function copy_dependent_nodemodules(export_to_dir) {
  if(!fse.existsSync(export_to_dir + '/' + '.nojekyll')) {
    create_empty_file(export_to_dir + '/' + '.nojekyll');
  }
  // TODO copy required node modules
  if(!fse.existsSync(export_to_dir + '/node_modules/jquery')) {
    var jquery_from = settings.get('app.root_dir') + '/node_modules/jquery/dist/jquery.min.js';
    var jquery_to = export_to_dir + '/node_modules/jquery/dist/';
    fse.copySync(jquery_from , jquery_to + '/jquery.min.js', { dereference: true });
  }
  if(!fse.existsSync(export_to_dir + '/node_modules/mathjax')) {
    let target_dirs = ['config', 'extensions', 'jax', 'MathJax.js']
    for( var i = 0; i < target_dirs.length; i++ ) {
      var mathjax_from = settings.get('app.root_dir') + '/node_modules/mathjax/' + target_dirs[i];
      var mathjax_to   = export_to_dir + '/node_modules/mathjax/' + target_dirs[i];
      fse.copySync(mathjax_from , mathjax_to, { dereference: true });
    }
  }
  if(!fse.existsSync(export_to_dir + '/node_modules/reveal.js')) {
    let target_dirs = ['css', 'js', 'lib', 'plugin'];
    for( var i = 0; i < target_dirs.length; i++ ) {
      var revealjs_from = settings.get('app.root_dir') + '/node_modules/reveal.js/' + target_dirs[i];
      var revealjs_to   = export_to_dir + '/node_modules/reveal.js/' + target_dirs[i];
      fse.copySync(revealjs_from , revealjs_to, { dereference: true });
    }
  }
}
