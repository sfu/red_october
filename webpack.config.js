var webpack = require('webpack');
var path = require('path');
module.exports = {
  resolve: {
    extensions: ['', '.js']
  },
  entry: ['./src/app.js'],
  output: {
    path: './public',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: require.resolve('react'), loader: 'expose?React' },
      { test: /\.less$/,   loader: "style!css!less" },
      { test: /\.json$/, loader: 'json-loader' }

    ]
  },
  resolve: {
    modulesDirectories: ['node_modules', 'src'],
  }
}