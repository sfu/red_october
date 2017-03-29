const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const config = require('config')
const routes = require('./routes')
const boom = require('express-boom')
const devErrorHandler = require('errorhandler')
const webpack = require('webpack')
const WebpackDevMiddleware = require('webpack-dev-middleware')
const WebpackHotMiddleware = require('webpack-hot-middleware')

const PRODUCTION = process.env.NODE_ENV === 'production'

const SESSION_CONFIG = {
  secret: config.get('session_secret'),
  resave: false,
  saveUninitialized: true,
  name: 'redoctober.sid'
}

const productionErrorHandler = (err, req, res, next) => {
  if (req.headers.accept === 'application/json') {
    res.boom.badImplementation()
  } else {
    res.status(500).send('<p>Internal Server Error</p>')
  }
  console.error(err.stack)
  next(err)
}

const createDevServer = app => {
  const webpackConfig = require('../webpack.config.js')()
  const compiler = webpack(webpackConfig)
  app.use(
    WebpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      hot: true,
      quiet: false,
      noInfo: true,
      stats: {
        assets: true,
        colors: true,
        version: true,
        hash: true,
        timings: true,
        chunk: false
      }
    })
  )
  app.use(WebpackHotMiddleware(compiler))

  return app
}

const createServer = app => {
  if (!PRODUCTION) {
    app = createDevServer(app)
  }
  app.use(boom())
  app.set('views', path.join(__dirname, 'views'))
  app.use(session(SESSION_CONFIG))
  app.use(favicon(path.resolve(__dirname, 'public/favicon.ico')))
  app.use(logger('dev'))
  app.use(cookieParser())
  app.use(express.static(path.resolve(__dirname, 'public')))
  app.use('/', routes)
  app.use(PRODUCTION ? productionErrorHandler : devErrorHandler())
  return app
}

module.exports = createServer
