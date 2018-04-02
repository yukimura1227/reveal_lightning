const path = require('path');

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
      renderer: './lib/js/renderer_process/setup.js',
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
    target: 'electron-renderer'
  },
];

