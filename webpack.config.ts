import path from 'path';

import { Configuration } from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const isDevelopment = process.env.NODE_ENV === 'development';

const commonConfiguration: Configuration = {
  mode: isDevelopment ? 'development' : 'production',
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  // https://github.com/yan-foto/electron-reload/issues/71
  externals: ['fsevents'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
    filename: '[name].js',
    assetModuleFilename: 'assets/[name][ext]',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.(ico|png|jpe?g|svg|eot|woff?2?)$/,
        type: 'asset/resource',
      },
    ],
  },

  watch: isDevelopment ? true : false,
  stats: 'errors-only',
  performance: { hints: false },

  devtool: isDevelopment ? 'inline-source-map' : undefined,
};

const mainConfiguration: Configuration = {
  ...commonConfiguration,
  target: 'electron-main',
  entry: {
    main: './src/main.ts',
  },
};

const preloadConfiguration: Configuration = {
  ...commonConfiguration,
  target: 'electron-preload',
  entry: {
    preload: './src/preload.ts',
  },
};

// レンダラープロセス向け設定
const rendererConfiguration: Configuration = {
  ...commonConfiguration,
  target: 'web',
  entry: {
    renderer: './src/renderer.tsx',
  },
  plugins: [
    new MiniCssExtractPlugin(),

    new HtmlWebpackPlugin({
      minify: !isDevelopment,
      inject: 'body',
      filename: 'index.html',
      template: './src/index.html',
    }),
  ],
};

// NOTE: development modeのときはレンダラープロセスのみ処理(メインプロセスはtscで）
const config = isDevelopment ? [rendererConfiguration] : [mainConfiguration, preloadConfiguration, rendererConfiguration];
export default config;
