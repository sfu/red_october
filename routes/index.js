var express = require('express');
var router = express.Router();
var ping = require('../lib/ping');
var events = require('events');
var Promise = require('bluebird');
var config = require('config');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Red October', session_id: req.sessionID });
});


router.post('/ping', function(req, res, next) {
  var url = req.body.url;
  var publishers = config.get('publishers');

  var pings = publishers.map(function(p) {
    return ping(p + url);
  });
  Promise.all(pings).then(function(responses) {JSON
    res.send(JSON.stringify(responses));
  })
});

module.exports = router;