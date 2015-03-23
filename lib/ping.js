'use strict';
var assign = require('object-assign');
var fetch = require('node-fetch');
fetch.Promise = require('bluebird');

module.exports = function(url, options) {
  var defaults = {
    timeout: 20000
  };
  options = options || {};
  assign(defaults, options);
  var start = process.hrtime();
  return fetch(url, defaults).then(function(res) {
    var diff = process.hrtime(start);
    var response = {
      url: res.url,
      status: res.status,
      statusText: res.statusText,
      ok: res.ok
    };
    response.elapsed_ns = diff[0] * 1e9 + diff[1];
    response.elapsed_ms = Math.round(response.elapsed_ns*1e-6);
    return response;
  }).catch(function(error) {
    return error;
  });
};