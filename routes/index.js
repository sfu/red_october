var express = require('express');
var router = express.Router();
var ping = require('../lib/ping');
var events = require('events');
var Promise = require('bluebird');
var config = require('config');
var cas = require('cas-sfu');

// authentication middleware
var cas_config = {
  casBasePath: '/cas',
  loginPath: '/login',
  logoutPath: '/logout',
  validatePath: '/serviceValidate',
  appLogoutPath: '/appLogout',
  service: config.get('cas_service'),
  userObject: 'auth'
}

if (config.has('cas_allow_string')) {
  cas_config.allow = config.get('cas_allow_string');
}

var casauth = cas.getMiddleware(cas_config);

var errobjconfig = {
  configurable: true,
  value: function() {
    var alt = {};
    var storeKey = function(key) {
      alt[key] = this[key];
    };
    Object.getOwnPropertyNames(this).forEach(storeKey, this);
    return alt;
  }
};
Object.defineProperty(Error.prototype, 'toJSON', errobjconfig);


var loggedin = function(req, res, next) {
  if (req.session && req.session.auth) {
    next();
    return;
  }
  req.session.referer = req.url;
  res.redirect('/login');
};

router.get('/', loggedin, function(req, res, next) {
  res.render('index', { title: 'Red October', session_id: req.sessionID });
});

router.post('/ping', function(req, res, next) {
  var url = req.body.url;
  var timeout = req.body.timeout || null;
  var publishers = config.get('publishers');
  var pings = publishers.map(function(p) {
    var options = timeout ? { timeout: parseInt(timeout) } : {};
    return ping(p + url, options).then(function(response) { return response; }).catch(function(error) { return error; });
  });
  Promise.all(pings).then(function(responses) {
    var ret = { successes: [], failures: []};
    responses.forEach(function(response) {
      if (response instanceof Error) {
        ret.failures.push(response.message);
      } else {
        ret.successes.push(response);
      }
    });
    res.send(JSON.stringify(ret));
  })
});

router.get('/isup', function(req, res) {
  res.status(200).end('ok');
});

// Authentication Routes
router.get('/login', casauth, function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  if (req.session) {
    req.session.destroy();
  }
  res.redirect(cas.options.casBase + cas.options.logoutPath + "?url=" + encodeURIComponent(cas.options.service) + "&urltext=Click+here+to+return+to+the+application.");
});




module.exports = router;