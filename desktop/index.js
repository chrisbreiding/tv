'use strict'

const _ = require('lodash')
const { app, dialog, BrowserWindow, ipcMain } = require('electron')
const chalk = require('chalk')
const Config = require('electron-config')
const mkdirp = require('mkdirp')
const path = require('path')
const Promise = require('bluebird')
const sanitize = require('sanitize-filename')
const url = require('url')
const fs = Promise.promisifyAll(require('fs-extra'))

const server = require('./lib/server')

const config = new Config()

let win

function createWindow () {
  if (win) return

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

app.on('ready', () => {
  createWindow()
  server.start().catch((error) => {
    console.log('Error starting server:', error)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  server.stop()
})

app.on('activate', createWindow)

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

const logError = (error, ...message) => {
  if (message && message.length) console.error(chalk.red(message.join(' ')))
  console.error(chalk.red(error))
}

server.on('handle:episode', (episode) => {
  createWindow()
  app.focus()

  const directories = getDirectories()

  if (!directories.downloads) {
    logError('Must set Downloads directory')
    return
  }

  if (!directories.tvShows) {
    logError('Must set TV Shows directory')
    return
  }

  // TODO: send message to UI that this is going on
  // with error if either directory doesn't exist

  dialog.showOpenDialog({
    title: 'Select Show',
    buttonLabel: 'Select',
  }, (filePaths) => {
    if (!filePaths || !filePaths.length) return

    const filePath = filePaths[0]
    const directory = path.dirname(filePath)
    const extension = path.extname(filePath)

    const newFileName = sanitize(episode.fileName)

    const newDirectory = path.join(directories.tvShows, episode.showName, `Season ${episode.season}`)
    fs.ensureDirAsync(newDirectory)
    .then(() => {
      const newFilePath = path.join(newDirectory, `${newFileName}${extension}`)
      const writeStream = fs.createWriteStream(newFilePath)

      writeStream.on('error', (error) => {
        logError(error, 'Error copying', filePath, 'to', newFilePath)
      })

      writeStream.on('finish', () => {
        // assumes file will only ever be in downloads or one level deep
        let toDelete = directory
        if (directory === directories.downloads) {
          toDelete = filePath
        }
        fs.removeAsync(toDelete).catch((error) => {
          logError(error, 'Error removing', toDelete)
        })
      })

      fs.createReadStream(filePath).pipe(writeStream)
    })
    .catch((error) => {
      logError(error, 'Failed to make directory', newDirectory)
    })
  })
})
