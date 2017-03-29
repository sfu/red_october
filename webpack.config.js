const webpack = require('webpack')
const { resolve } = require('path')

module.exports = (env = {}) => {
  const addItem = (add, item) => add ? item : undefined
  const ifProd = item => addItem(env.prod, item)
  const ifDev = item => addItem(!env.prod, item)
  const removeEmpty = array => array.filter(i => !!i)

  const config = {
    entry: ['whatwg-fetch', './src/app.js'],

    output: {
      filename: env.prod ? 'bundle.[chunkhash].js' : 'bundle.js',
      path: resolve(__dirname, 'public')
    },

    devtool: env.prod ? 'source-map' : 'eval',

    resolve: {
      modules: ['src', 'node_modules']
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
        { test: /\.json$/, loader: 'json-loader' }
      ]
    },

    plugins: removeEmpty([
      ifProd(
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false,
          quiet: true
        })
      ),

      ifProd(
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: true,
          compress: {
            warnings: false,
            screw_ie8: true
          }
        })
      ),

      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: env.prod ? '"production"' : '"development"'
        }
      })
    ])
  }
  return config
}
