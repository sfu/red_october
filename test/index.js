'use strict';
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expected_keys = ['url', 'status', 'statusText', 'ok', 'elapsed_ns', 'elapsed_ms'];

describe('PingTest', function() {
  var ping = require('../lib/ping');

  it('should fetch the page and return an object containing the elapsed time in ns, elapsed time in ms and the response object', function(done) {
    var promise = ping('http://www.sfu.ca');
    promise.should.eventually.be.an('object').with.keys(expected_keys).and.and.notify(done);
  });

  it('should handle a timeout by returning an error object', function(done) {
    var promise = ping('http://www.sfu.ca', {timeout: 1});
    promise.should.eventually.be.an.instanceOf(Error).and.should.notify(done);
  });

  it('should be able to ping an array of urls', function(done) {
    var urls = [
      'http://www.sfu.ca/',
      'http://www.sfu.ca/itservices',
      'http://www.google.com'
    ];

    var Promise = require('bluebird');
    var promises = Promise.map(urls, function(url) {
      return ping(url);
    });
    promises.then(function(responses) {
      responses.should.be.an('array').with.length(urls.length);
      responses[0].should.be.an('object').with.keys(expected_keys);
    }).then(done);
  });
});