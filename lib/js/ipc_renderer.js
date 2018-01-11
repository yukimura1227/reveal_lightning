// 非同期でメインプロセスからのメッセージを受信する
ipcRenderer.on('open-preference-dialog', function(args) {
  open_preference_dialog();
});

ipcRenderer.on('image-paste', function(args) {
  $('#js-image-paste-btn').trigger('click');
});

ipcRenderer.on('start-server-reply', function(args) {
  alert('success restart server');
});

function call_start_server() {
  ipcRenderer.send('start-server', 'port changed');
}
