const React = require('react')
const Quote = require('./Quote')
const quotelist = require('./quotes.json')

const Footer = () => (
  <footer>
    <Quote quotes={quotelist} />
    <p style={{ margin: '30px 0 0 0' }}>Made with ♥ by gnb.</p>
  </footer>
)

module.exports = Footer
