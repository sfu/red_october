var React = require('react');

var blockquoteStyle = {
    margin: '30px 0 0 0',
    paddingLeft: '15px;',
    borderLeft: '2px solid #aaa',
    width: '80%'
};

var quoteAttributionStyle = {
    display: 'block'
};

var Quote = React.createClass({

    propTypes: {
        quotes: React.PropTypes.array.isRequired
    },

    getQuote() {
        var quotes = this.props.quotes;
        var quote = quotes[Math.floor(Math.random() * (quotes.length))];
        return {
            quote: quote[0],
            name: quote[1]
        };
    },

    render: function() {
        var quote = this.getQuote();
        return (
            <blockquote style={blockquoteStyle}>&ldquo;{quote.quote}&rdquo; <span style={quoteAttributionStyle} class="quote_attribution">&ndash; <em>{quote.name}</em></span></blockquote>
        );
    }

});

module.exports = Quote;