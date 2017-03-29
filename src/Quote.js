const React = require('react')

const blockquoteStyle = {
  margin: '30px 0 0 0',
  paddingLeft: '15px',
  borderLeft: '2px solid #aaa',
  width: '80%'
}

const quoteAttributionStyle = {
  display: 'block'
}

const Quote = React.createClass({
  propTypes: {
    quotes: React.PropTypes.array.isRequired
  },

  getQuote() {
    const quotes = this.props.quotes
    const quote = quotes[Math.floor(Math.random() * quotes.length)]
    return {
      quote: quote[0],
      name: quote[1]
    }
  },

  render: function() {
    const quote = this.getQuote()
    return (
      <blockquote style={blockquoteStyle}>
        “
        {quote.quote}
        ”
        {' '}
        <span style={quoteAttributionStyle} className="quote_attribution">
          – <em>{quote.name}</em>
        </span>
      </blockquote>
    )
  }
})

module.exports = Quote
