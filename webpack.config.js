const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPartialsPlugin = require('html-webpack-partials-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname,'src/js/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'pblic')
  },
  watchOptions: {
    ignored: /node_modules/,
    poll: 1000,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            // plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      }
    ]
  },
  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      files: ['./public/*.html'],
      server: { 
        baseDir: ['public'] 
      }
    }),
    new HtmlWebpackPlugin({
      template: 'src/templates/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
    new HtmlWebpackPartialsPlugin({
      path: path.join(__dirname, 'src/templates/form.html'), 
      location: 'body'
    }),
    new HtmlWebpackPartialsPlugin({
      path: path.join(__dirname, 'src/templates/login.html'), 
      location: 'body'
    })
  ],
};