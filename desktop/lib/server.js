'use strict'

const bodyParser = require('body-parser')
const { EventEmitter } = require('events')
const express = require('express')
const Promise = require('bluebird')

const allowedDomains = /^(https?:\/\/tv\.crbapps\.com|http:\/\/localhost:800\d)/
const emitter = new EventEmitter()
const app = express()

app.use((req, res, next) => {
  const origin = req.get('Origin')
  if (allowedDomains.test(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    next()
  } else {
    res.sendStatus(403)
  }
})

app.use(bodyParser.json())

app.post('/', (req, res) => {
  emitter.emit('handle:episode', req.body.episode)
  res.sendStatus(200)
})

app.get('/ping', (req, res) => {
  res.sendStatus(200)
})

module.exports = {
  on: emitter.on.bind(emitter),

  start () {
    return new Promise((resolve, reject) => {
      this.server = app.listen(4192, () => {
        resolve()
      })

      this.server.on('error', (error) => {
        reject(error)
      })
    })
  },

  stop () {
    this.server && this.server.close()
  },
}
