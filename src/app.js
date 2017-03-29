require('./less/style.less')

const React = require('react')
const ReactDOM = require('react-dom')
const PingForm = require('./PingForm')
const Quote = require('./Quote')
const quotelist = require('./quotes.json')

window.onload = function() {
  ReactDOM.render(<PingForm />, document.getElementById('app'))
  ReactDOM.render(
    <Quote quotes={quotelist} />,
    document.getElementById('quote')
  )
}
