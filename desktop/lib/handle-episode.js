'use strict'

const _ = require('lodash')
const PlexAPI = require("plex-api")
const Promise = require('bluebird')

const runPreflight = require('./run-preflight')
const getFile = require('./get-file')
const moveFile = require('./move-file')
const ipc = require('./ipc')
const util = require('./util')

const plex = new PlexAPI('MBP13.local')
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

const refreshPlex = () => {
  return plex.find("/library/sections", { title: "TV Shows" })
  .then((directories) => {
    const uri = _.get(directories, '[0].uri')
    if (uri) {
      return plex.perform(`${uri}/refresh`)
    }
  })
  .catch(() => {
    // couldn't connect, no big deal
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

  handlers[episode.id] = episode
  sendHandlingNotice(episode, true)

  runPreflight()
  .then(getFile(handlers, episode))
  .then(moveFile(episode))
  .then(notifySuccess(episode))
  .then(() => {
    delete handlers[episode.id]
    sendHandlingNotice(episode, false)
    if (!_.size(handlers)) {
      return refreshPlex()
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
