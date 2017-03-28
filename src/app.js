require('./less/style.less');

var React = require('react');
var ReactDOM = require('react-dom');
var PingForm = require('./PingForm');
var Quote = require('./Quote');
var quotelist = require('./quotes.json');

window.onload = function() {
  ReactDOM.render(<PingForm />, document.getElementById('app'));
  ReactDOM.render(<Quote quotes={quotelist} />, document.getElementById('quote'));
};
