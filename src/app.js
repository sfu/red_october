require('./less/style.less');

var React = require('react');
var PingForm = require('./PingForm');

React.render(<PingForm />, document.getElementById('app'));