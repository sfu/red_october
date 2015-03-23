var express = require('express');
var router = express.Router();
var ping = require('../lib/ping');
var events = require('events');
var Promise = require('bluebird');
var config = require('config');

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

router.get('/', function(req, res, next) {
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

module.exports = router;