const path    = require('path');
const webpack = require('webpack'); //to access built-in plugins

module.exports = [
  // Electron設定
  {
    entry: {
      main: './index.js',
    },
    output: {
      // path: path.join(__dirname, 'packed'),
      path: __dirname,
      filename: 'main_bundled.js',
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
      ],
    },
    target: 'electron-main',
  }
  , {
    entry: {
      renderer: [
        './lib/js/renderer_process/setup.js',
        './lib/js/renderer_process/utility.js',
        './lib/js/renderer_process/tools.js',
        './lib/js/renderer_process/context_menu.js',
        './lib/js/renderer_process/markdown_support.js',
        './lib/js/renderer_process/ipc_renderer.js',
        './lib/js/renderer_process/drag_and_drop.js'
      ]
    },
    output: {
      path: path.join(__dirname, 'lib/js/renderer_process'),
      filename: 'renderer_bundled.js',
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
      ],
    },
    target: 'electron-renderer',
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ]
  },
];

