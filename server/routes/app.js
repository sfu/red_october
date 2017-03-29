const { resolve } = require('path')
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const pingAll = require('../lib/pingAll')
const config = require('config')
const cas = require('cas-sfu')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

// authentication middleware
const cas_config = {
  casBasePath: '/cas',
  loginPath: '/login',
  logoutPath: '/logout',
  validatePath: '/serviceValidate',
  appLogoutPath: '/appLogout',
  service: config.get('cas_service'),
  userObject: 'auth'
}

if (config.has('cas_allow_string')) {
  cas_config.allow = config.get('cas_allow_string')
}

const casauth = cas.getMiddleware(cas_config)

const loggedin = function(req, res, next) {
  if (
    (req.session && req.session.auth) ||
    (config.has('bypass_cas') && config.get('bypass_cas'))
  ) {
    next()
    return
  }
  req.session.referer = req.url
  res.redirect('/login')
}

router.get('/', loggedin, function(req, res) {
  res.sendFile(resolve(__dirname, '../html/index.html'))
})

router.post('/ping', function(req, res) {
  const url = req.body.url
  const timeout = req.body.timeout || null
  const publishers = config.get('publishers')

  pingAll(url, timeout, publishers).then(function(data) {
    res.send(JSON.stringify(data))
  })
})

router.get('/isup', function(req, res) {
  res.status(200).end('ok')
})

// Authentication Routes
router.get('/login', casauth, function(req, res) {
  console.log('logged in?')
  res.redirect('/')
})

router.get('/logout', function(req, res) {
  if (req.session) {
    req.session.destroy()
  }
  res.redirect(
    cas.options.casBase +
      cas.options.logoutPath +
      '?url=' +
      encodeURIComponent(cas.options.service) +
      '&urltext=Click+here+to+return+to+the+application.'
  )
})

module.exports = router
