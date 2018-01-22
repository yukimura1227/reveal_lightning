"use strict";

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
  put2editor("\n----------\n");
});

$('#js-section-separate-btn').on('click', function() {
  put2editor("\n---\n");
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

function open_preference_dialog() {
  var theme_select_box_html = create_theme_select_box_html();
  vex.open({
    unsafeContent: [
      '<form class="vex-dialog-form">',
        '<div class ="vex-dialog-input">',
          '<div class="uk-grid">',
            '<label class="uk-width-1-4 vertical-margin-middle" for="js-config-serverport">listen port</label>',
            '<div class="uk-width-1-4">',
              '<input type="number" id="js-config-serverport" value="' + settings.get('server.port') + '"/>',
            '</div>',
            '<div class="uk-width-2-4"></div>',

            '<label class="uk-width-1-4">theme</label>',
            '<div class="uk-width-3-4">',
              theme_select_box_html.join(''),
            '</div>',

            '<label class="uk-width-1-4">contents dir</label>',
            '<div class="uk-width-3-4">',
              '<input type="text" id="js-config-work-dir" value="' + settings.get('env.work_dir') + '"/>',
            '</div>',

            '<label class="uk-width-1-4">export to</label>',
            '<div class="uk-width-3-4">',
              '<input type="text" id="js-config-export-to" value="' + settings.get('export.to') + '"/>',
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
      $('#js-config-work-dir').on("change", function() {
        var link_dist          = $(this).val();
        var link_from          = parse_path(link_dist).basename;
        var link_from_fullpath = settings.get('app.server_root') + '/' + link_from;
        if(fs.existsSync(link_from_fullpath)) {
          fs.unlinkSync(link_from_fullpath);
        }
        fs.symlinkSync(link_dist, link_from_fullpath, 'dir');
        settings.set('env', { work_dir: link_dist, work_dir_name: link_from });
      });
      $('#js-config-export-to').on("change", function() {
        var export_to = $(this).val();
        settings.set('export', { to: export_to });
      });
    }
  });
};

// TODO: move to another file
function open_new_file_dialog() {
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

function open_load_file_dialog() {
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
