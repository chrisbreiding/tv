'use strict'

const _ = require('lodash')
const { app, dialog, BrowserWindow, ipcMain } = require('electron')
const chalk = require('chalk')
const Config = require('electron-config')
const path = require('path')
const Promise = require('bluebird')
const sanitize = require('sanitize-filename')
const url = require('url')
const fs = Promise.promisifyAll(require('fs-extra'))

const server = require('./lib/server')

const config = new Config()

let win

const isDev = process.env.NODE_ENV === 'development'

const logError = (error, ...message) => {
  if (message && message.length) console.error(chalk.red(message.join(' '))) // eslint-disable-line no-console
  console.error(chalk.red(error)) // eslint-disable-line no-console
}

const getWindowSettings = () => config.get('window') || {}

const updateWindowSettings = (newSettings) => {
  config.set('window', _.extend(getWindowSettings(), newSettings))
}

function createWindow () {
  if (win) return Promise.resolve()

  const windowSettings = getWindowSettings()

  win = new BrowserWindow({
    width: windowSettings.width || 600,
    height: windowSettings.height || (isDev ? 700 : 400),
    x: windowSettings.x,
    y: windowSettings.y,
    webPreferences: {
      preload: path.join(__dirname, 'lib', 'ipc.js'),
      nodeIntegration: false,
    },
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
      if (isDev && windowSettings.isDevToolsOpen !== false) {
        win.webContents.openDevTools()
      }
      resolve()
    })

    win.on('resize', _.debounce(() => {
      const [width, height] = win.getSize()
      const [x, y] = win.getPosition()
      updateWindowSettings({ width, height, x, y })
    }, 1000))

    win.on('moved', _.debounce(() => {
      const [x, y] = win.getPosition()
      updateWindowSettings({ x, y })
    }, 1000))

    win.webContents.on('devtools-opened', () => {
      updateWindowSettings({ isDevToolsOpen: true })
    })

    win.webContents.on('devtools-closed', () => {
      updateWindowSettings({ isDevToolsOpen: false })
    })
  })
}

app.on('ready', () => {
  createWindow()
  server.start().catch((error) => {
    logError(error, 'Error starting server')
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

const sendHandlingNotice = (isHandling) => {
  win.webContents.send('handling:episode', isHandling)
}

const sendNotification = (notification) => {
  win.webContents.send('notification', notification)
}

const handlingError = (title, message, type = 'error') => {
  const error = new Error()
  error.title = title
  error.message = message
  error.type = type
  return error
}

const wrapAndThrowError = (title, type) => (error) => {
  throw handlingError(title, error.message, type)
}

const getFile = (directories) => {
  return new Promise((resolve, reject) => {
    dialog.showOpenDialog({
      title: 'Select Show',
      buttonLabel: 'Select',
      defaultPath: directories.downloads,
      filters: [
        { name: 'Movies', extensions: ['mkv', 'avi', 'mp4', 'm4v'] },
      ],
    }, (filePaths) => {
      if (filePaths && filePaths[0]) {
        resolve(filePaths[0])
      } else {
        reject(handlingError('Canceled handling episode', '', 'info'))
      }
    })
  })
}

const ensureDirectories = (directories) => {
  let directoriesSet = true

  if (!directories.downloads) {
    directoriesSet = false
    sendNotification({
      title: 'Error handling episode: must set Downloads directory',
      type: 'error',
    })
  }

  if (!directories.tvShows) {
    directoriesSet = false
    sendNotification({
      title: 'Error handling episode: must set TV Shows directory',
      type: 'error',
    })
  }

  if (!directoriesSet) {
    throw handlingError('')
  }
}

const copyFile = (from, to) => {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(to)

    writeStream.on('error', (error) => {
      reject(handlingError(`Error copying ${from} to ${to}`, error.message))
    })

    writeStream.on('finish', () => {
      resolve()
    })

    fs.createReadStream(from).pipe(writeStream)
  })
}

server.on('handle:episode', (episode) => {
  const directories = getDirectories()

  createWindow()
  .then(() => {
    app.focus()
    sendHandlingNotice(true)
    return ensureDirectories(directories)
  })
  .then(() => {
    const newDirectory = path.join(directories.tvShows, episode.showName, `Season ${episode.season}`)
    return fs.ensureDirAsync(newDirectory)
      .return(newDirectory)
      .catch(wrapAndThrowError(`Failed to make directory ${newDirectory}`))
  })
  .then((newDirectory) => {
    return getFile(directories)
      .then((filePath) => [newDirectory, filePath])
  })
  .then(([newDirectory, filePath]) => {
    const extension = path.extname(filePath)
    const newFileName = sanitize(episode.fileName)
    const newFilePath = path.join(newDirectory, `${newFileName}${extension}`)

    return copyFile(filePath, newFilePath)
      .return([filePath, newFilePath])
  })
  .then(([filePath, newFilePath]) => {
    // assumes file will only ever be in downloads or one level deep
    let toDelete = path.dirname(filePath)
    if (toDelete === directories.downloads) {
      toDelete = filePath
    }
    return fs.removeAsync(toDelete)
      .return([filePath, newFilePath])
      .catch(wrapAndThrowError(`Error removing ${toDelete}`))
  })
  .then(([filePath, newFilePath]) => {
    sendNotification({
      title: 'Finished renaming and moving episode',
      message: `${filePath} renamed and moved to ${newFilePath}`,
      type: 'success',
    })
    sendHandlingNotice(false)
  })
  .catch((error) => {
    if (error.title) {
      sendNotification(error)
    }
    sendHandlingNotice(false)
  })
})
