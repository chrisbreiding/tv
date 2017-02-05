'use strict'

const { ipcMain } = require('electron')
const window = require('./window')

const on = (requestName, callback) => {
  ipcMain.on(`${requestName}:request`, (event, ...args) => {
    callback((...reponseArgs)  => {
      event.sender.send(`${requestName}:response`, ...reponseArgs)
    }, ...args)
  })
}

const send = (eventName, data) => {
  return window.ensure().then((win) => {
    win.webContents.send(eventName, data)
  })
}

module.exports = {
  on,
  send,
}
