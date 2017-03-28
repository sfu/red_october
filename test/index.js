'use strict';
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

chai.should();
chai.use(chaiAsPromised);

const expected_keys = ['url', 'status', 'statusText', 'ok', 'elapsed_ns', 'elapsed_ms'];

describe('PingTest', function() {
  const ping = require('../lib/ping');

  it('should fetch the page and return an object containing the elapsed time in ns, elapsed time in ms and the response object', function(done) {
    const promise = ping('http://www.sfu.ca');
    promise.should.eventually.be.an('object').with.keys(expected_keys).and.and.notify(done);
  });

  it('should handle a timeout by returning an error object', function(done) {
    const promise = ping('http://www.sfu.ca', {timeout: 1});
    promise.should.eventually.be.an.instanceOf(Error).and.should.notify(done);
  });

  it('should be able to ping an array of urls', function(done) {
    const urls = [
      'http://www.sfu.ca/',
      'http://www.sfu.ca/itservices',
      'http://www.google.com'
    ];

    const Promise = require('bluebird');
    const promises = Promise.map(urls, function(url) {
      return ping(url);
    });
    promises.then(function(responses) {
      responses.should.be.an('array').with.length(urls.length);
      responses[0].should.be.an('object').with.keys(expected_keys);
    }).then(done);
  });
});
