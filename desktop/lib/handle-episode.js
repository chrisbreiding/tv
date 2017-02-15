'use strict'

const Promise = require('bluebird')

const getFile = require('./get-file')
const ipc = require('./ipc')
const moveFile = require('./move-file')
const plex = require('./plex')
const queue = require('./episode-queue')
const runPreflight = require('./run-preflight')
const util = require('./util')

const notifyCanceled = (episode) => (error) => {
  queue.update(episode.id, {
    state: queue.CANCELED,
    info: { reason: error.message },
  })
}

const notifySuccess = (episode, moveOnly) => ([from, to]) => {
  const title = `Finished handling episode for **${episode.show.displayName}**`
  const message = moveOnly ?
    `*${util.tildeify(from)}*\nrenamed and moved to\n*${util.tildeify(to)}*` :
    `*${episode.fileName}*\ndownloaded and moved to\n*${util.tildeify(to)}*`

  queue.update(episode.id, {
    state: queue.FINISHED,
    info: { title, message },
  })
}

const maybeRefreshPlex = () => {
  if (queue.isEmpty()) {
    return plex.refresh()
    .then(() => {
      ipc.send('notification', {
        title: 'Refreshing Plex TV Shows',
        type: 'success',
      })
    })
  }
}

const notifyError = (episode) => (error) => {
  queue.update(episode.id, { state: queue.ERROR, error })
}

const notHandlingError = (error) => !error.isHandlingError

const massageUncaughtError = (episode) => (error) => {
  throw new util.HandlingError(
    'Unexpected error while handling episode',
    `${episode.fileName}\n\n${error.stack}`
  )
}

const notifyErrors = (episode) => (errors) => {
  const message = 'Multiple errors while handling episode'
  const stack = `${episode.fileName}\n\n${errors.map((error) => error.stack).join('\n\n')}`
  throw new util.HandlingError(message, stack)
}

module.exports = (episode, moveOnly) => {
  if (queue.has(episode.id)) return

  queue.add(episode.id, {
    episode,
    state: queue.STARTED,
  })

  runPreflight()
  .then(getFile(episode)[moveOnly ? 'select' : 'download'])
  .then(moveFile(episode))
  .then(notifySuccess(episode, moveOnly))
  .then(maybeRefreshPlex)
  .catch(util.CancelationError, notifyCanceled(episode))
  .catch(Promise.AggregateError, notifyErrors(episode))
  .catch(notHandlingError, massageUncaughtError(episode))
  .catch(notifyError(episode))
  .finally(() => {
    queue.remove(episode.id)
  })
}
