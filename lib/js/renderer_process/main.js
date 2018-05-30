require ('./setup.js');
require('./context_menu.js');
require('./drag_and_drop.js');
require('./ipc_renderer.js');
require('./markdown_support.js');
require('./tools.js');
require('./utility.js');

// TODO: expose-loaderを使ってjqueryオブジェクトをグローバルに持たせるのが
// 正しいのかもしれない(要調査)
// とりあえず、暫定的に$にjQueryオブジェクトを持たせたいので、以下のようにしている
window.$ = $
