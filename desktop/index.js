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

const isDev = process.env.NODE_ENV === 'development'

function createWindow () {
  if (win) return Promise.resolve()

  win = new BrowserWindow({
    width: 600,
    height: isDev ? 700 : 400,
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

  return new Promise((resolve) => {
    win.webContents.on('did-finish-load', () => {
      win.webContents.openDevTools()
      resolve()
    })
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

const sendHandling = (details) => {
  win.webContents.send('handling:episode', details)
}

server.on('handle:episode', (episode) => {
  createWindow().then(() => {
    app.focus()

    const directories = getDirectories()

    sendHandling({ isHandling: true })

    let hasError = false

    if (!directories.downloads) {
      hasError = true
      sendHandling({
        title: 'Error handling episode: must set Downloads directory',
        type: 'error',
        isHandling: false,
      })
    }

      if (!directories.tvShows) {
      hasError = true
      sendHandling({
        title: 'Error handling episode: must set TV Shows directory',
        type: 'error',
        isHandling: false,
      })
    }

    if (hasError) {
      return
    }

    dialog.showOpenDialog({
      title: 'Select Show',
      buttonLabel: 'Select',
      defaultPath: directories.downloads,
      filters: [
        { name: 'Movies', extensions: ['mkv', 'avi', 'mp4', 'm4v'] },
      ],
    }, (filePaths) => {
      if (!filePaths || !filePaths.length) {
        sendHandling({
          title: 'Canceled handling episode',
          isHandling: false,
        })
        return
      }

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
          sendHandling({
            title: `Error copying ${filePath} to ${newFilePath}`,
            message: error.message,
            type: 'error',
            isHandling: false,
          })
        })

        writeStream.on('finish', () => {
          // assumes file will only ever be in downloads or one level deep
          let toDelete = directory
          if (directory === directories.downloads) {
            toDelete = filePath
          }
          fs.removeAsync(toDelete)
          .then(() => {
            sendHandling({
              title: 'Finished renaming and moving episode',
              message: `${filePath} renamed and moved to ${newFilePath}`,
              type: 'success',
              isHandling: false,
            })
          })
          .catch((error) => {
            sendHandling({
              title: `Error removing ${toDelete}`,
              message: error,
              type: 'error',
              isHandling: false,
            })
          })
        })

        fs.createReadStream(filePath).pipe(writeStream)
      })
      .catch((error) => {
        sendHandling({
          title: `Failed to make directory ${newDirectory}`,
          message: error,
          type: 'error',
          isHandling: false,
        })
      })
    })
  })
})
