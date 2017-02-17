'use strict'

const _ = require('lodash')
const { app, dialog } = require('electron')

const eventBus = require('./lib/event-bus')
const ipc = require('./lib/ipc')
const queue = require('./lib/episode-queue')
const server = require('./lib/server')
const util = require('./lib/util')
const handleEpisode = require('./lib/handle-episode')
const window = require('./lib/window')

app.on('ready', () => {
  window.ensure()
  server.start().catch((error) => {
    ipc.send('notification', {
      title: 'Error starting server',
      message: error.message,
      type: 'error',
    })
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

app.on('activate', window.ensure)

ipc.on('get:directories', (respond) => {
  respond(null, _.transform(util.getDirectories(), (dirs, dirPath, dirName) => {
    dirs[dirName] = util.tildeify(dirPath)
  }))
})

ipc.on('select:directory', (respond, directory) => {
  dialog.showOpenDialog({
    title: `Select ${_.startCase(directory)} Directory`,
    buttonLabel: 'Select',
    properties: ['openDirectory', 'createDirectory'],
  }, (directoryPaths) => {
    if (!directoryPaths || !directoryPaths.length) {
      return respond()
    }

    const directoryPath = directoryPaths[0]
    util.setDirectory(directory, directoryPath)
    respond(null, util.tildeify(directoryPath))
  })
})

ipc.on('fetch:queue', (respond) => {
  respond(null, queue.items())
})

eventBus.on('handle:episode', (episode, moveOnly) => {
  window.ensure()
  .then(() => {
    app.focus()
    handleEpisode(episode, moveOnly)
  })
})

eventBus.on('focus', () => {
  app.focus()
})
