const path = require('path');

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
  }
}