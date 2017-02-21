const _ = require('lodash')
const path = require('path')
const Promise = require('bluebird')
const TF = require('teeeff')
const trash = require('trash')
const WebTorrent = require('webtorrent')

const eventBus = require('./event-bus')
const ipc = require('./ipc')
const queue = require('./episode-queue')
const util = require('./util')

const webTorrent = new WebTorrent()

const selectTorrent = (episode, torrents) => {
  queue.update({ id: episode.id, state: queue.SELECT_TORRENT, items: torrents })
  eventBus.emit('focus')

  const clear = () => queue.update({ id: episode.id, items: [] })

  return ipc.request('select:torrent', episode.id)
  .tap(clear)
  .get('magnetLink')
  .catch({ message: 'cancel' }, util.wrapCancelationError('Canceled selecting torrent'))
  .catch(util.notCancelationError, util.wrapHandlingError('Error selecting torrent'))
}

const search = (episode, query) => {
  return Promise.resolve(TF.search(query, {
    category: '205', // TV Shows
    orderBy: 'date',
    sortBy: 'desc',
    filter: { verified: false },
  }))
  .timeout(10000)
  .then((results) => {
    return _(results)
      .sortBy((result) => Number(result.seeders))
      .reverse()
      .value()
  })
}

const getLink = (episode) => {
  queue.update({ id: episode.id, state: queue.SEARCHING_TORRENTS })

  const off = () => ipc.off(`cancel:queue:item:${episode.id}`)

  return new Promise((resolve, reject) => {
    const epNum = `s${util.pad(episode.season)}e${util.pad(episode.episode_number)}`
    search(episode, `${episode.show.searchName} ${epNum}`)
    .then((results) => {
      return results.length ? results : search(episode, episode.show.searchName)
    })
    .then((results) => resolve(results))
    .catch((error) => reject(error))

    ipc.once(`cancel:queue:item:${episode.id}`, () => {
      queue.update({ id: episode.id, state: queue.CANCELING })
      reject(new util.CancelationError('Canceled searching for torrents'))
    })
  })
  .then((results) => {
    if (!results.length) {
      throw new util.HandlingError('Could not find any torrents for episode')
    }

    const firstResult = results[0]
    if (
      util.matchesEpisodeName(episode, firstResult.name) &&
      (results.length === 1 || Number(firstResult.seeders) > 100)
    ) {
      return firstResult.magnetLink
    } else {
      return selectTorrent(episode, results)
    }
  })
  .catch(Promise.TimeoutError, util.wrapHandlingError('Timed out searching for torrents'))
  .catch(util.notCancelationError, util.wrapHandlingError('Error searching for torrents'))
  .finally(off)
}

const download = (episode, directory) => (magnetLink) => {
  const download = new Promise((resolve, reject) => {
    queue.update({
      id: episode.id,
      state: queue.DOWNLOADING_TORRENT,
      info: {
        progress: 0,
        timeRemaining: null,
      },
    })

    let statusPollingId

    webTorrent.add(magnetLink, { path: directory }, (torrent) => {
      statusPollingId = setInterval(() => {
        queue.update({
          id: episode.id,
          info: {
            progress: torrent.progress, // from 0 to 1
            timeRemaining: torrent.timeRemaining, // in milliseconds
          },
        })
      }, 1000)

      torrent.on('done', () => {
        clearInterval(statusPollingId)
        queue.update({ id: episode.id, state: queue.REMOVING_TORRENT, info: null })
        const filePaths = _.map(torrent.files, (file) => {
          return path.join(directory, file.path)
        })
        torrent.destroy(() => {
          resolve(filePaths)
        })
      })

      torrent.on('error', (error) => {
        clearInterval(statusPollingId)
        reject(new util.HandlingError('Error downloading torrent', error.message))
      })

      ipc.once(`cancel:queue:item:${episode.id}`, () => {
        queue.update({ id: episode.id, state: queue.CANCELING })
        clearInterval(statusPollingId)
        const filePaths = _.map(torrent.files, (file) => {
          return path.join(directory, file.path)
        })
        torrent.destroy(() => {
          // TODO: this destroys the files, but not any containing directories
          trash(filePaths)
          reject(new util.CancelationError('Canceled downloading torrent'))
        })
      })
    })

    webTorrent.on('error', (error) => {
      clearInterval(statusPollingId)
      reject(new util.HandlingError('Error downloading torrent', error.message))
    })
  })
  .finally(() => {
    ipc.off(`cancel:queue:item:${episode.id}`)
  })

  return download
}

module.exports = {
  getLink,
  download,
}
