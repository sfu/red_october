require('./less/style.less');

var React = require('react');
var PingForm = require('./PingForm');

window.onload = function() {
  React.render(<PingForm />, document.getElementById('app'));
};