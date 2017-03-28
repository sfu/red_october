'use strict';
const assign = require('object-assign');
const fetch = require('node-fetch');

module.exports = function(url, options) {
  const defaults = {
    timeout: 20000
  };
  options = options || {};
  assign(defaults, options);
  const start = process.hrtime();
  return fetch(url, defaults).then(function(res) {
    const diff = process.hrtime(start);
    const response = {
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
