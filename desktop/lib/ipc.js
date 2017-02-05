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

const send = (eventName, ...args) => {
  return window.ensure().then((win) => {
    win.webContents.send(eventName, ...args)
  })
}

module.exports = {
  on,
  send,
}
