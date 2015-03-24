require('./less/style.less');

var React = require('react');
var PingForm = require('./PingForm');
var Quote = require('./Quote');
var quotelist = require('./quotes.json');

window.onload = function() {
  React.render(<PingForm />, document.getElementById('app'));
  React.render(<Quote quotes={quotelist} />, document.getElementById('quote'));
};