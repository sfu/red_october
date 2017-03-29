const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const webpackMiddleware = require('webpack-dev-middleware')
const session = require('express-session')
const config = require('config')
const webpackConfig = require('./webpack.config.js')
const routes = require('./routes/index')

const app = express()

app.enable('trust proxy')

app.use(
  session({
    secret: config.get('session_secret'),
    resave: false,
    saveUninitialized: true,
    name: 'redoctober.sid'
  })
)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

if (app.get('env') === 'development') {
  webpackConfig.devtool = 'eval'
  webpackConfig.output.path = '/'
  app.use(
    webpackMiddleware(require('webpack')(require('./webpack.config.js')), {
      publicPath: '/'
    })
  )
}

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(__dirname + '/public'))
app.use('/', routes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    console.error(err)
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  console.error(err)
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
