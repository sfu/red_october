module.exports = {
  resolve: {
    modules: [
      'src',
      'node_modules'
    ]
  },
  entry: ['./src/app.js'],
  output: {
    path: './public',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      { test: /\.less$/,   loader: "style-loader!css-loader!less-loader" },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  }
};
