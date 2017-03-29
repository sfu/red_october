require('./less/style.less')

const React = require('react')
const ReactDOM = require('react-dom')
const PingForm = require('./PingForm')
const Footer = require('./Footer')

const App = () => (
  <div>
    <div className="main">
      <h1>RED OCTOBER</h1>
      <PingForm />
    </div>
    <Footer />
  </div>
)

ReactDOM.render(<App />, document.getElementById('page-content'))
