const express = require('express')
const assert = require('assert')
const config = require('config')
const createServer = require('./server')

if (process.env.NODE_ENV === 'production') {
  const bypassCas = config.has('bypass_cas') && config.get('bypass_cas')
  assert(!bypassCas, `Don't use bypass_cas in production.`)
}

const app = express()
const PORT = config.get('app_port')
app.set('trust proxy')

createServer(app).listen(PORT, () => {
  console.info(`HTTP server listening on port ${PORT}`)
})
