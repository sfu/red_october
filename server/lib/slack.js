const request = require('request')

const HELP_TEXT = `"Give me a ping, Vasili. One ping only, please." – Captain Marko Ramius

\`/redoctober\` checks the status of each AEM publisher by attempting to fetch a URL.
It reports the response time of each publisher, as well as any failures.

Usage:

\`/redoctober\` checks the publishers by fetching \`/itservices.html\`
\`/redoctober help\` displays this help text
\`/redoctober /some/path.html\` checks the publishers by fetching the specified path. Use a relative path only.

Red October is also available on the World Wide Web: http://redoctober.its.sfu.ca

Made with :heart: by @grahamb. He would also liked to have seen Montanna.
`

const formatMessage = results => {
  const message = { attachments: [] }
  const successes = results.successes.map(function(s) {
    return {
      title: s.url,
      value: `Response time: ${s.elapsed_ms} ms\nStatus: ${s.status} ${s.statusText}`,
      short: false
    }
  })

  const failures = results.failures.map(function(f) {
    return {
      title: f,
      short: false
    }
  })

  if (successes.length) {
    message.attachments.push({
      color: 'good',
      title: 'Successes',
      text: 'The following publishers appear to be up:',
      fields: successes
    })
  }

  if (failures.length) {
    message.attachments.push({
      color: 'danger',
      title: 'Failures',
      text: 'The following publishers appear to be down:',
      fields: failures
    })
  } else {
    message.attachments.push({
      title: 'Failures',
      text: 'No failures detected. Everything is ship-shape, Captain.'
    })
  }
  return message
}

const sendMessage = (uri, json) => {
  const postOptions = {
    uri,
    json,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  request(postOptions, error => {
    if (error) {
      throw new Error(error)
    }
  })
}

module.exports = {
  HELP_TEXT,
  sendMessage,
  formatMessage
}
