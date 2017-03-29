const React = require('react')
const PropTypes = React.PropTypes
const Results = React.createClass({
  propTypes: {
    successes: PropTypes.array,
    failures: PropTypes.array,
    showResults: PropTypes.bool,
  },
  successes(data) {
    const renderRows = function(data) {
      return data.map((r, i) => {
        return (
          <tr key={i}>
            <td>{r.url}</td>
            <td>{r.status}</td>
            <td>{r.statusText}</td>
            <td>{r.elapsed_ms} ms</td>
          </tr>
        )
      })
    }

    return (
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>URL</th>
            <th>Status Code</th>
            <th>Status Text</th>
            <th>Response Time</th>
          </tr>
        </thead>
        <tbody>
          {renderRows(data)}
        </tbody>
      </table>
    )
  },

  failures(data) {
    if (!data.length) {
      return <p>No failures. Everything is ship-shape, Captain.</p>
    } else {
      return (
        <ul>
          {this.props.failures.map((result, i) => {
            return <li key={i}>{result}</li>
          })}
        </ul>
      )
    }
  },

  render: function() {
    if (this.props.showResults) {
      return (
        <div style={{ marginTop: '40px' }}>
          <h3>Successes</h3>
          {this.successes(this.props.successes)}
          <h3>Failures</h3>
          {this.failures(this.props.failures)}
        </div>
      )
    } else {
      return null
    }
  },
})

module.exports = Results
