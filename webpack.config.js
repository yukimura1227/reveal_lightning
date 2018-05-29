const path = require('path');
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
        './lib/js/renderer_process/main.js',
      ]
    },
    output: {
      path: path.join(__dirname, 'lib/js/renderer_process'),
      filename: 'renderer_bundled.js',
      library: ['RevealLightning'],
      libraryTarget: 'umd'
    },
    // entry: {
    //   setup:            './lib/js/renderer_process/setup.js',
    //   utility:          './lib/js/renderer_process/utility.js',
    //   tools:            './lib/js/renderer_process/tools.js',
    //   context_menu:     './lib/js/renderer_process/context_menu.js',
    //   markdown_support: './lib/js/renderer_process/markdown_support.js',
    //   ipc_renderer:     './lib/js/renderer_process/ipc_renderer.js'
    // },
    // output: {
    //   path: path.join(__dirname, 'lib/js/renderer_process'),
    //   filename: "RevealLightning.[name].bundled.js",
    //   library: ["RevealLightning", "[name]"],
    //   libraryTarget: "umd"
    // },
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

