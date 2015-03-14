var webpack = require('webpack');
var path = require('path');
module.exports = {
  devtool: 'eval',
  entry: ['./src/app.js'],
  output: {
    path: path.resolve('./public'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: require.resolve('react'), loader: 'expose?React' },
      { test: /\.less$/,   loader: "style!css!less" },

    ]
  },
  resolve: {
    modulesDirectories: ['node_modules', 'src'],
  },
}