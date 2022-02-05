"use strict";

const fs = require('fs');
const settings   = require('electron-settings');
const electron   = require('electron');
const {clipboard, remote, shell} = electron;
const {dialog}   = remote;
const parse_path = require('parse-filepath');

import {load_markdown_file} from './markdown_support.js';
import {put2editor} from './utility.js';
import {editor} from './markdown_support.js';

window.addEventListener('DOMContentLoaded',function() {
  $('#js-grid-template-btn').on('click', function() {
    put2editor("## GridTemplate\n");
    put2editor("###### lead sentence\n");
    put2editor("__{:l}__\n");
    put2editor("- left content\n");
    put2editor("  * xxx\n");
    put2editor("__$__\n");
    put2editor("\n");
    put2editor("__{:r}__\n");
    put2editor("- right content\n");
    put2editor("  * xxx\n");
    put2editor("__$__\n");
    put2editor("\n");
    put2editor("__{:follow}__\n");
    put2editor("sub footer\n");
    put2editor("__$__\n");
    put2editor("\n");
    put2editor("__{:f}__\n");
    put2editor("footer\n");
    put2editor("__$__\n");
    $('#js-reload-reveal-view-btn').trigger('click');
  });

  $('#js-image-paste-btn').on('click', function() {
    var datetime = new Date().getTime();
    var write_dir = settings.get('target_md.file_dir') + '/';
    var image_file_name = datetime + '.png';
    var image_file_path = write_dir + image_file_name;
    var availableFormats = clipboard.availableFormats()
    var image_data = clipboard.readImage().toPng();
    console.log(image_data);
    fs.writeFile(image_file_path, image_data, function (error) {
      console.log(error);
    });
    // すぐにappendするとファイルが読み込めないので、waitしてからappend
    setTimeout(
      function () {
        put2editor("![](" + settings.get('target_md.file_relative_dir') + '/' + image_file_name + ")\n");
        $('#js-markdown-input').trigger('change');
      },
      500
    );
  });

  $('#js-chapter-separate-btn').on('click', function() {
    put2editor("----------\n");
    $('#js-reload-reveal-view-btn').trigger('click');
  });

  $('#js-section-separate-btn').on('click', function() {
    put2editor("---\n");
    $('#js-reload-reveal-view-btn').trigger('click');
  });

  $('#js-open-browser-btn').on('click', function() {
    shell.openExternal(settings.get('url.presentation'));
  });

  $('#js-print-btn').on('click', function() {
    shell.openExternal(settings.get('url.print'));
  });

  $('#js-reload-reveal-view-btn').on('click', function() {
    remote.getCurrentWindow().webContents.session.clearCache(() => {});
    $('#js-reveal-view')[0].contentDocument.location.reload(true);
  });

  $('#js-fragment-btn').on('click', function() {
    put2editor('<!-- .element: class="fragment" -->');
  });

  $('#js-fragment-grow-btn').on('click', function() {
    put2editor('<!-- .element: class="fragment grow" -->');
  });

  $('#js-fragment-shrink-btn').on('click', function() {
    put2editor('<!-- .element: class="fragment shrink" -->');
  });

  $('#js-fragment-fade-up-btn').on('click', function() {
    put2editor('<!-- .element: class="fragment fade-up" -->');
  });

  $('#js-fragment-fade-down-btn').on('click', function() {
    put2editor('<!-- .element: class="fragment fade-down" -->');
  });

  $('#js-fragment-fade-left-btn').on('click', function() {
    put2editor('<!-- .element: class="fragment fade-left" -->');
  });

  $('#js-fragment-fade-right-btn').on('click', function() {
    put2editor('<!-- .element: class="fragment fade-right" -->');
  });

  $('#js-fragment-current-visible-btn').on('click', function() {
    put2editor('<!-- .element: class="fragment current-visible" -->');
  });

  $('#js-fragment-highlight-current-blue-btn').on('click', function() {
    put2editor('<!-- .element: class="fragment highlight-current-blue" -->');
  });

  $('#js-fragment-highlight-red-btn').on('click', function() {
    put2editor('<!-- .element: class="fragment highlight-red" -->');
  });

  $('#js-style-full-width-btn').on('click', function() {
    put2editor('<!-- .element: style="width: 100%" -->');
  });
}, false);

function select_directory(dialog_title, callback) {
  return dialog.showOpenDialog(global.mainWindow,
    {
      properties: ['openDirectory']
    },
    callback,
  );
}

export function open_preference_dialog() {
  var theme_select_box_html = create_theme_select_box_html();
  vex.open({
    contentClassName: 'vex-content width_800',
    unsafeContent: [
      '<style>',
        '.width_800 {',
            'width: 800px !important;',
        '}',
      '</style>',
      '<form class="vex-dialog-form">',
        '<div class ="vex-dialog-input">',
          '<div class="uk-grid">',
            '<label class="uk-width-1-4 vertical-margin-middle" for="js-config-serverport">listen port</label>',
            '<div class="uk-width-1-4">',
              '<input type="number" id="js-config-serverport" value="' + settings.get('server.port') + '"/>',
            '</div>',
            '<div class="uk-width-1-2"></div>',

            '<label class="uk-width-1-4">theme</label>',
            '<div class="uk-width-1-2">',
              theme_select_box_html.join(''),
            '</div>',
            '<div class="uk-width-1-4"></div>',

            '<label class="uk-width-1-4">editor-theme</label>',
            '<div class="uk-width-1-2">',
              create_editor_theme_select_box_html().join(''),
            '</div>',
            '<div class="uk-width-1-4"></div>',

            '<label class="uk-width-1-4">editor-keybinding</label>',
            '<div class="uk-width-1-2">',
              create_editor_keybind_select_box_html().join(''),
            '</div>',
            '<div class="uk-width-1-4"></div>',

            '<label class="uk-width-1-4">workspace</label>',
            '<div class="uk-width-1-2">',
              '<select id="js-config-work-dir">',
                create_workspace_select_option_html().join(''),
              '</select>',
            '</div>',
            '<div class="uk-width-1-4">',
              '<button type="button" class="uk-button uk-button-primary js-file-select-dialog" data-target="#js-config-work-dir">select</button>',
            '</div>',
            '<label class="uk-width-1-4">export to</label>',
            '<div class="uk-width-1-2" id="js-config-export-to-dir-wrap">',
              '<select id="js-config-export-to">',
                create_export_to_select_option_html().join(''),
              '</select>',
            '</div>',
            '<div class="uk-width-1-4">',
              '<button type="button" class="uk-button uk-button-primary js-file-select-dialog" data-target="#js-config-export-to">select</button>',
            '</div>',
          '</div>',
        '</div>',
      '</form>'
    ].join(''),
    showCloseButton: false,
    afterOpen: function() {
      $("#js-config-serverport").on("change", function() {
        var port_new = $(this).val();
        settings.set('server', {port: port_new});
        // TODO: Simplify
        settings.set('url', {
          presentation: 'http://localhost:' + settings.get('server.port') + '/reveal_view.html',
          print: settings.get('url.presentation') + '?print-pdf'
        });
        call_start_server();
      });
      $("#js-change-theme").on("change", function() {
        fs.writeFileSync(settings.get('app.config_file.theme'), '{ "theme_css_path": "node_modules/reveal.js/css/theme/' + this.value + '", "theme_css_filename": "' + this.value + '"}');
        $('#js-reload-reveal-view-btn').trigger('click');
      });
      $("#js-change-editor-theme").on("change", function() {
        var theme = $(this).val();
        settings.set('editor', { theme: theme });
        editor.setTheme('ace/theme/' + settings.get('editor.theme'));
      });
      $("#js-change-editor-keybinding").on("change", function() {
        var keybinding_name = $(this).val();
        settings.set('keybinding', { handler: keybinding_name });
        var keyboard_handler = '';
        if(settings.get('keybinding.handler') == 'ace') {
          keyboard_handler = '';
        } else {
          keyboard_handler = 'ace/keyboard/' + settings.get('keybinding.handler')
        }
        editor.setKeyboardHandler(keyboard_handler);
        console.log(editor.getKeyboardHandler());
      });
      $('#js-config-work-dir').on("change", function() {
        var link_dist          = $(this).val();
        var link_from          = parse_path(link_dist).basename;
        var link_from_fullpath = settings.get('app.server_root') + '/' + link_from;
        if(fs.existsSync(link_from_fullpath)) {
          fs.unlinkSync(link_from_fullpath);
        }
        fs.symlinkSync(link_dist, link_from_fullpath, 'junction');
        add_dir_history(link_dist, 'work_dir_history');
        settings.set('env', { work_dir: link_dist, work_dir_name: link_from });
      });
      $('#js-config-export-to').on("change", function() {
        var export_to = $(this).val();
        add_dir_history(export_to, 'export_dir_history');
        settings.set('export', { to: export_to });
      });
      $('.js-file-select-dialog').on("click", function() {
        let set_target_id = $(this).data('target');
        let set_target_element = $(set_target_id);
        const callback = function(selected_dir_paths) {
          if(selected_dir_paths != undefined) {
            var selected_dir_path = selected_dir_paths[0];
            // TODO: 非常にキモチワルイ実装なので整理してリファクタしたい
            // 事前にoptionに追加した上で、val(selected_dir_path)で選択する
            if(set_target_element[0].tagName.toLowerCase() === 'select') {
              $(set_target_element).append($('<option>').html(selected_dir_path).val(selected_dir_path));
            }
            set_target_element.val(selected_dir_path).change();
          } else {
            console.log('cacneled!!');
          }
        }
        select_directory('choose workspace', callback);
      });
    }
  });
};

// TODO: move to another file
export function open_new_file_dialog() {
  vex.dialog.open({
    input: [
      '<div class="uk-grid">',
        '<label class="uk-width-1-4 vertical-margin-middle" for="input-file-keyword">filename</label>',
        '<div class="uk-width-3-4">',
          '<input type="text" name="file_keyword" id="input-file-keyword" style="width: 80%; required "/>.md',
        '</div>',
      '</div>'
    ].join(''),
    showCloseButton: false,
    buttons: [
      $.extend({}, vex.dialog.buttons.YES, { text: 'Save' }),
      $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
    ],
    callback: function (data) {
      if (!data) {
        console.log('Canceled');
      } else {
        var file_name          = data.file_keyword + '.md';
        var write_file_dir     = settings.get('env.work_dir') + '/' + data.file_keyword;
        var file_relative_dir  = settings.get('env.work_dir_name') + '/' + data.file_keyword;
        var write_file_path    = write_file_dir + '/' + file_name;
        var relative_file_path = file_relative_dir + '/' + file_name;
        console.log('write_file_dir: ' + write_file_dir);
        if(!fs.existsSync(write_file_dir)) {
          fs.mkdirSync(write_file_dir);
          fs.writeFileSync(write_file_path, '');
          settings.set('target_md', {
            file_dir: write_file_dir,
            file_path: write_file_path,
            file_relative_dir: file_relative_dir,
            file_relative_path: relative_file_path
          });

          fs.writeFileSync(settings.get('app.config_file.load_target'), '{ "load_target": "' + relative_file_path + '" }');

          load_markdown_file();
          $('#js-reload-reveal-view-btn').trigger('click');

        } else {
          alert('Error file is already exists!!');
        }
      }
    }
  });
};

function create_theme_select_box_html() {
  var theme_json_str = fs.readFileSync(settings.get('app.config_file.theme'), 'UTF-8');
  var theme_json = JSON.parse(theme_json_str);
  var select_box_html = [];
  select_box_html.push('<select id="js-change-theme">');
  var fileList = fs.readdirSync(settings.get('app.root_dir') + '/node_modules/reveal.js/css/theme/');
  for (var i = 0; i < fileList.length; i++) {
    if( fileList[i].endsWith('.css')) {
      var selected_attr = theme_json.theme_css_filename == fileList[i] ? 'selected' : ''
      select_box_html.push('<option ' + selected_attr + ' value="' + fileList[i] + '">' + fileList[i] + '</option>');
    }
  }
  select_box_html.push('</select>');
  return select_box_html;
}

function create_editor_theme_select_box_html() {
  var current_theme = settings.get('editor.theme');
  console.log(current_theme);
  var select_box_html = [];
  select_box_html.push('<select id="js-change-editor-theme">');
  var fileList = fs.readdirSync(settings.get('app.root_dir') + '/node_modules/brace/theme');
  for (var i = 0; i < fileList.length; i++) {
    if( fileList[i].match(/.*\.js/)) {
      var theme_name = fileList[i].match(/(.*)\.js/)[1];
      var selected_attr = current_theme == theme_name ? 'selected' : '';
      console.log(theme_name);
      select_box_html.push('<option ' + selected_attr + ' value="' + theme_name + '">' + theme_name + '</option>');
    }
  }
  select_box_html.push('</select>');
  return select_box_html;
}

function create_editor_keybind_select_box_html() {
  var current_keybinding = settings.get('keybinding.handler');
  console.log(current_keybinding);
  var select_box_html = [];
  select_box_html.push('<select id="js-change-editor-keybinding">');
  var fileList = fs.readdirSync(settings.get('app.root_dir') + '/node_modules/brace/keybinding/');
  // aceのkeybindはjsファイルとしては存在しないがace内部的に保持しているようなので、追加
  fileList.unshift('ace.js');

  for (var i = 0; i < fileList.length; i++) {
    if( fileList[i].match(/.*\.js/)) {
      var keybinding_name = fileList[i].match(/(.*)\.js/)[1];
      var selected_attr = current_keybinding == keybinding_name ? 'selected' : '';
      console.log(keybinding_name);
      select_box_html.push('<option ' + selected_attr + ' value="' + keybinding_name + '">' + keybinding_name + '</option>');
    }
  }
  select_box_html.push('</select>');
  return select_box_html;
}

function create_workspace_select_option_html() {
  var work_dir_history = settings.get('work_dir_history.data');

  var select_box_html = [];
  for (var i = 0; i < work_dir_history.length; i++) {
    if( work_dir_history[i] == settings.get('env.work_dir') ) {
      select_box_html.push('<option value="' + work_dir_history[i] + '" selected>' + work_dir_history[i] + '</option>');
    } else {
      select_box_html.push('<option value="' + work_dir_history[i] + '">' + work_dir_history[i] + '</option>');
    }
  }
  return select_box_html;
}

function recreate_workspace_select_box_html() {
  $('#js-config-work-dir').html( create_workspace_select_option_html().join('') );
}

function create_export_to_select_option_html() {
  var export_dir_history = settings.get('export_dir_history.data');

  var select_box_html = [];
  select_box_html.push('');
  for (var i = 0; i < export_dir_history.length; i++) {
    if( export_dir_history[i] == settings.get('export.to') ) {
      select_box_html.push('<option value="' + export_dir_history[i] + '" selected>' + export_dir_history[i] + '</option>');
    } else {
      select_box_html.push('<option value="' + export_dir_history[i] + '">' + export_dir_history[i] + '</option>');
    }
  }
  return select_box_html;
}

function recreate_export_to_select_box_html() {
  $('#js-config-export-to-dir-wrap').html( create_export_to_select_option_html().join('') );
}


function create_file_links() {
  var file_links = [];
  var dirList = fs.readdirSync(settings.get('env.work_dir'));
  for (var i = 0; i < dirList.length; i++) {
    file_links.push('<div class="uk-width-1-1"><a href="javascript:void(0);" onclick="$(\'#js-open-file-keyword\').val(\'' + dirList[i] + '\');">' + dirList[i] + '</a></div>');
  }
  return file_links;
}

function create_file_link_table_tag() {
  var table_tag = [];
  var dirList = fs.readdirSync(settings.get('env.work_dir'));
  table_tag.push('<div style="height: 250px; overflow-y:scroll" class="uk-width-1-1">');
  table_tag.push('  <table class="uk-table uk-table-hover uk-table-striped uk-table-small">');
  table_tag.push('    <tbody>');
  for (var i = 0; i < dirList.length; i++) {
    table_tag.push('      <tr style="cursor : pointer;">');
    table_tag.push('        <td onclick="$(\'#js-open-file-keyword\').val(\'' + dirList[i] + '\');">' + dirList[i] + '</td>');
    table_tag.push('      </tr>');
  }
  table_tag.push('    </tbody>');
  table_tag.push('  </table>');
  table_tag.push('</div>');
  return table_tag.join('');
}

export function open_load_file_dialog() {
  vex.dialog.open({
    input: [
      '<div class="uk-grid">',
        create_file_link_table_tag(),
        '<div class="uk-width-1-1">',
          '<input type="text" name="file_keyword" id="js-open-file-keyword" style="width: 80%; border-color: #E5E5E5; background-color: #DDD; color: #999;" readonly required/>.md',
        '</div>',
      '</div>'
    ].join(''),
    showCloseButton: false,
    buttons: [
      $.extend({}, vex.dialog.buttons.YES, { text: 'Open' }),
      $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
    ],
    callback: function (data) {
      if (!data) {
        console.log('Canceled');
      } else {
        var file_name          = data.file_keyword + '.md';
        var read_file_dir      = settings.get('env.work_dir') + '/' + data.file_keyword;
        var file_relative_dir  = settings.get('env.work_dir_name') + '/' + data.file_keyword;
        var read_file_path     = read_file_dir + '/' + file_name;
        var relative_file_path = file_relative_dir + '/' + file_name;
        console.log('read_file_dir: ' + read_file_dir);
        if(fs.existsSync(read_file_dir)) {
          settings.set('target_md', {
            file_dir: read_file_dir,
            file_path: read_file_path,
            file_relative_dir: file_relative_dir,
            file_relative_path: relative_file_path
          });

          fs.writeFileSync(settings.get('app.config_file.load_target'), '{ "load_target": "' + relative_file_path + '" }');

          load_markdown_file();
          $('#js-reload-reveal-view-btn').trigger('click');

        } else {
          alert('File Not Found!!');
        }
      }
    }
  });
}

export function open_progress_dialog() {
  vex.open({
    unsafeContent: [
      '<div>',
        '<div class="uk-width-1-1">Downloading...</div>',
        '<div class="uk-width-1-10"></div>',
        '<progress id="js-download-progress" class="uk-width-8-10 uk-progress" value="0" max="100"></progress>',
        '<div class="uk-width-1-10"></div>',
      '</div>',
    ].join(''),
    showCloseButton: false,
    escapeButtonCloses: false,
    overlayClosesOnClick: false
  });
}

function update_progress_dialog(percent) {
  $('#js-download-progress').val(percent);
}

function add_dir_history(dir, history_key) {
  var current_history = settings.get(history_key).data;
  // remove value if already exists
  if( current_history.indexOf(dir) != -1 ) {
    current_history.splice(current_history.indexOf(dir), 1);
  }

  current_history.unshift(dir)

  console.log(current_history);
  settings.set(history_key, { data: current_history });
  recreate_workspace_select_box_html();
}
