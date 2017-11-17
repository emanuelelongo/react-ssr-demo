const path = require('path');

module.exports = {
  entry: './src/app/index.js',

  output: {
    path: path.resolve('build/assets'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  }
}