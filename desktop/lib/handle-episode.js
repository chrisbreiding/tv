'use strict'

const _ = require('lodash')
const Promise = require('bluebird')

const runPreflight = require('./run-preflight')
const getFile = require('./get-file')
const moveFile = require('./move-file')
const ipc = require('./ipc')
const plex = require('./plex')
const util = require('./util')

const handlers = {}

const sendHandlingNotice = (episode, isHandling) => {
  ipc.send('handling:episode', episode, isHandling)
}

const sendNotification = (notification) => {
  return ipc.send('notification', notification)
}

const notifySuccess = (episode) => ([filePath, newFilePath]) => {
  return sendNotification({
    title: `Finished handling episode for **${episode.show.displayName}**`,
    message: `*${util.tildeify(filePath)}*\n  renamed and moved to\n*${util.tildeify(newFilePath)}*`,
    type: 'success',
  })
}

const notHandlingError = (error) => !error.isHandlingError

const massageUncaughtError = (episode) => (error) => {
  error.title = 'Unexpected error while handling episode'
  error.message = `${episode.fileName}\n\n${error.stack}`
  error.type = 'error'
  throw error
}

const notifyErrors = (errors) => {
  return errors.map(sendNotification)
}

module.exports = (episode) => {
  if (handlers[episode.id]) return

  // TODO: make this more complex, with reference to the current state
  // need to store a queue that the front end can ask for when it loads
  handlers[episode.id] = episode
  sendHandlingNotice(episode, true)

  runPreflight()
  // TODO: fork here if user already has file and just wants to rename/move it
  .then(getFile(handlers, episode).download)
  .then(moveFile(episode))
  .then(notifySuccess(episode))
  .then(() => {
    delete handlers[episode.id]
    sendHandlingNotice(episode, false)
    if (!_.size(handlers)) {
      return plex.refresh()
      .then(() => sendNotification({
        title: 'Refreshing Plex TV Shows',
        type: 'success',
      }))
    }
  })
  .catch(Promise.AggregateError, notifyErrors)
  .catch(notHandlingError, massageUncaughtError(episode))
  .catch(sendNotification)
  .then(() => {
    delete handlers[episode.id]
    sendHandlingNotice(episode, false)
  })
}
