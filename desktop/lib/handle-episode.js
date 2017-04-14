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
  return queue.update({
    id: episode.id,
    state: queue.CANCELED,
    info: { title: error.message },
  })
}

const notifySuccess = (episode, moveOnly) => ([from, to]) => {
  const title = `Finished handling episode for **${episode.show.displayName}**`
  const message = moveOnly ?
    `*${util.tildeify(from)}*\n\nrenamed and moved to\n\n*${util.tildeify(to)}*` :
    `*${episode.fileName}*\n\ndownloaded and moved to\n\n*${util.tildeify(to)}*`

  return queue.update({
    id: episode.id,
    state: queue.FINISHED,
    info: { title, message },
  })
}

const maybeRefreshPlex = () => {
  if (queue.size()) return

  const numSucceeded = queue.numSucceeded()
  queue.reset()

  if (numSucceeded > 0) {
    return plex.refresh()
    .then(() => {
      return ipc.send('notification', {
        title: 'Refreshing Plex TV Shows',
        type: 'success',
      })
    })
    .catch(util.CancelationError, () => {}) // do nothing on cancel
    .catch((error) => {
      return ipc.send('notification', {
        title: error.message,
        message: error.details,
        type: 'error',
      })
    })
  }
}

const notifyError = (episode) => ({ message, details, stack }) => {
  if (util.isDev) {
    /* eslint-disable no-console */
    console.error('Handling failure:')
    console.error(message)
    console.error(details)
    console.error(stack)
    /* eslint-enable no-console */
  }

  return queue.update({
    id: episode.id,
    state: queue.FAILED,
    info: { title: message, message: details },
  })
}

const massageUncaughtError = (episode) => (error) => {
  throw new util.HandlingError(
    'Unexpected error while handling episode',
    `${episode.fileName}\n\n${error.stack}`
  )
}

const notifyErrors = (episode) => (errors) => {
  if (errors.length === 1) {
    throw new util.HandlingError(errors[0].message, errors[0].details)
  }

  const message = 'Multiple errors while handling episode'
  const details = `${episode.fileName}\n\n${errors.map((error) => {
    return error.details ? `${error.message}\n\n${error.details}` : error.message
  }).join('\n\n--------------\n\n')}`
  throw new util.HandlingError(message, details)
}

module.exports = (episode, moveOnly) => {
  if (queue.has(episode.id)) return

  queue.add({
    id: episode.id,
    episode,
    state: queue.STARTED,
  })

  runPreflight()
  .then(getFile(episode)[moveOnly ? 'select' : 'download'])
  .then(moveFile(episode))
  .then(notifySuccess(episode, moveOnly))
  .catch(util.CancelationError, notifyCanceled(episode))
  .catch(util.HandlingError, notifyError(episode))
  .catch(Promise.AggregateError, notifyErrors(episode))
  .catch(massageUncaughtError(episode))
  .finally(() => {
    queue.remove(episode.id)
    return maybeRefreshPlex()
  })
}
