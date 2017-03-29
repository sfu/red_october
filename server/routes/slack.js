const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const pingAll = require('../lib/pingAll')
const config = require('config')
const slack = require('../lib/slack')

router.use(bodyParser.json())

const verifyToken = function(req, res, next) {
  const token = req.body.payload
    ? JSON.parse(req.body.payload).token
    : req.body.token

  if (token !== config.slack.verification_token) {
    res.status(403).send({ error: 'unauthenticated' })
  } else {
    next()
  }
}

router.post('/ping', verifyToken, function(req, res) {
  res.status(200).end()
  const {
    text,
    response_url
  } = req.body

  const url = text || '/itservices.html'

  switch (url) {
    case 'help':
      slack.sendMessage(response_url, {
        text: slack.HELP_TEXT
      })
      break
    default: {
      slack.sendMessage(response_url, {
        text: `Pinging \`${url}\`, stand by…`
      })
      const intervalId = setInterval(
        () => {
          slack.sendMessage(response_url, {
            text: `Ping…`
          })
        },
        1500
      )
      pingAll(url, null, config.get('publishers')).then(function(results) {
        console.log(results)
        clearInterval(intervalId)
        slack.sendMessage(response_url, slack.formatMessage(results))
      })
    }
  }
})

module.exports = router
