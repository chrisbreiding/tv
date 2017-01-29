const _ = require('lodash')
const { app, dialog, BrowserWindow, ipcMain } = require('electron')
const Config = require('electron-config')
const path = require('path')
const url = require('url')

const config = new Config()

let win

function createWindow () {
  win = new BrowserWindow({
    width: 400,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'lib', 'ipc.js'),
      nodeIntegration: false,
    }
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'build', 'index.html'),
    protocol: 'file:',
    slashes: true,
  }))

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

const on = (requestName, callback) => {
  ipcMain.on(`${requestName}:request`, (event, ...args) => {
    callback((...reponseArgs)  => {
      event.sender.send(`${requestName}:response`, ...reponseArgs)
    }, ...args)
  })
}

const getDirectories = () => {
  return config.get('directories') || {}
}

on('get:directories', (respond) => {
  respond(null, getDirectories())
})

on('select:directory', (respond, directory) => {
  dialog.showOpenDialog({
    title: `Select ${_.startCase(directory)} Directory`,
    buttonLabel: 'Select',
    properties: ['openDirectory'],
  }, (directoryPaths) => {
    if (!directoryPaths || !directoryPaths.length) {
      return respond()
    }

    const directoryPath = directoryPaths[0]
    config.set('directories', _.extend({}, getDirectories(), {
      [directory]: directoryPath,
    }))
    respond(null, directoryPath)
  })
})
