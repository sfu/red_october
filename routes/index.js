var express = require('express');
var router = express.Router();
var pingAll = require('../lib/pingAll');
var config = require('config');
var cas = require('cas-sfu');
var slack = require('../lib/slack');

if ('production' === process.env.NODE_ENV && config.has('bypass_cas') && config.get('bypass_cas')) {
  console.error('WARNING: You have bypass_cas enabled in production. This is probably not what you want. Check your config file.');
}


// authentication middleware
var cas_config = {
  casBasePath: '/cas',
  loginPath: '/login',
  logoutPath: '/logout',
  validatePath: '/serviceValidate',
  appLogoutPath: '/appLogout',
  service: config.get('cas_service'),
  userObject: 'auth'
};

if (config.has('cas_allow_string')) {
  cas_config.allow = config.get('cas_allow_string');
}

var casauth = cas.getMiddleware(cas_config);

var verifyToken = function(req, res, next) {
  const token = req.body.payload ?
    JSON.parse(req.body.payload).token :
    req.body.token;

  if (token !== config.slack.verification_token) {
    res.status(403).send({error: 'unauthenticated'});
  } else {
    next();
  }
};

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
  if ((req.session && req.session.auth) || (config.has('bypass_cas') && config.get('bypass_cas'))) {
    next();
    return;
  }
  req.session.referer = req.url;
  res.redirect('/login');
};

router.get('/', loggedin, function(req, res) {
  res.render('index', { title: 'Red October', session_id: req.sessionID });
});

router.post('/ping', function(req, res) {
  var url = req.body.url;
  var timeout = req.body.timeout || null;
  var publishers = config.get('publishers');

  pingAll(url, timeout, publishers).then(function(data) {
    res.send(JSON.stringify(data));
  });
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

// slack routes

router.post('/slack/ping', verifyToken, function(req, res) {
  res.status(200).end();
  const {
    text,
    response_url,
  } = req.body;

  slack.sendMessage(response_url, {
    "text": "Pinging, stand by…"
  });

  var url = text || '/itservices.html';
  pingAll(url, null, config.get('publishers')).then(function(results) {
    console.log(results);
    var message = {
      replace_original: true,
      attachments: []
    };

    var successes = results.successes.map(function(s) {
      return {
        title: s.url,
        value: 'Response time: ' + s.elapsed_ms + 'ms',
        short: false
      };
    });

    if (successes.length) {
      message.attachments.push({
        color: 'good',
        title: 'Successes',
        text: 'The following publishers appear to be up:',
        fields: successes
      });
    }

    var failures = results.failures.map(function(f) {
      return {
        title: f,
        short: false
      };
    });

    if (failures.length) {
      message.attachments.push({
        color: 'danger',
        title: 'Failures',
        text: 'The following publishers appear to be down:',
        fields: failures
      });
    } else {
      message.attachments.push({
        title: 'Failures',
        text: "No failures detected. Everything is ship-shape, Captain."
      });
    }

    slack.sendMessage(response_url, message);
  });
});


module.exports = router;
