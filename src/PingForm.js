const React = require('react')
const Results = require('./Results')

const PingForm = React.createClass({
  getInitialState() {
    return {
      show_results: false,
      show_pinging: false,
      successes: [],
      failures: [],
    }
  },

  pinging() {
    if (this.state.show_pinging) {
      return <h2>PINGING…</h2>
    } else {
      return null
    }
  },

  ping(ev) {
    const setState = function(state) {
      this.setState({
        successes: state.successes,
        failures: state.failures,
        show_results: true,
        show_pinging: false,
      })
    }.bind(this)

    ev.preventDefault()
    this.setState(
      {
        show_pinging: true,
        show_results: false,
      },
      function() {
        const body = {
          url: this.urlInput.value,
        }
        fetch('./ping', {
          method: 'post',
          body: JSON.stringify(body),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
          .then(function(response) {
            return response.json()
          })
          .then(function(json) {
            setState(json)
          })
      }.bind(this),
    )
  },

  render() {
    return (
      <div>
        <p>
          Enter the path of the page that you want to test. Red October will attempt to fetch the page from each of the AEM publishers and dispay the results.
        </p>
        <p>Requests will time out after 20 seconds.</p>
        <form id="ping" action="/ping" method="POST">
          <label style={{ display: 'inline' }} htmlFor="url">
            http://www.sfu.ca
          </label>
          <input
            type="text"
            id="url"
            ref={input => {
              this.urlInput = input
            }}
            name="url"
            defaultValue="/itservices.html"
            placeholder="/path/to/page/to/test.html"
          />
          <input
            onClick={this.ping}
            type="submit"
            value="Give me a ping, Vasily. One ping only, please."
          />
        </form>
        {this.pinging()}
        <Results
          showResults={this.state.show_results}
          successes={this.state.successes}
          failures={this.state.failures}
        />
      </div>
    )
  },
})

module.exports = PingForm
