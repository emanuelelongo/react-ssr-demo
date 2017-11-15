const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './app/index.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = {
  // what the bundle will contain
  entry: './app/index.js',

  // where the bundle will be located
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js'
  },

  // how the bundle is built (transpiling js, etc)
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },

  // using a html template 
  plugins: [HtmlWebpackPluginConfig]
}