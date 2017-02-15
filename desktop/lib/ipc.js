'use strict'

const _ = require('lodash')
const { ipcMain } = require('electron')
const Promise = require('bluebird')
const window = require('./window')

const on = (requestName, callback) => {
  ipcMain.on(`${requestName}:request`, (event, ...args) => {
    callback((...reponseArgs)  => {
      event.sender.send(`${requestName}:response`, ...reponseArgs)
    }, ...args)
  })
}

const request = (requestName, id, ...args) => {
  return window.ensure().then((win) => {
    return new Promise((resolve, reject) => {
      win.webContents.send(`${requestName}:request`, id, ...args)
      ipcMain.once(`${requestName}:response:${id}`, (event, error, response) => {
        if (error) {
          reject(_.extend(new Error(''), error))
        } else {
          resolve(response)
        }
      })
    })
  })
}

const send = (eventName, ...args) => {
  return window.ensure().then((win) => {
    win.webContents.send(eventName, ...args)
  })
}

module.exports = {
  on,
  request,
  send,
}
