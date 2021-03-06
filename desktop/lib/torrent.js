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
  .catch(util.isCancelationError, util.wrapCancelationError('Canceled selecting torrent'))
  .catch(util.notCancelationError, util.wrapHandlingError('Error selecting torrent'))
}

const search = (strategy, episode, query) => {
  return Promise.resolve(TF.search(query, {
    category: 'tv',
    orderBy: 'date',
    sortBy: 'desc',
    filter: { verified: false },
    strategy,
  }))
  .timeout(20000)
  .then((results) => {
    return _(results)
      .sortBy('seeders')
      .reverse()
      .value()
  })
}

const haveSeeders = (torrents) => {
  return !!_.some(torrents, (torrent) => torrent.seeders > 0)
}

const MAX_ATTEMPTS = 4

const searchTorrents = (episode) => {
  const { searchName } = episode.show
  const epNum = `s${util.pad(episode.season)}e${util.pad(episode.number)}`

  const attempts = [
    () => search('b', episode, `${searchName} ${epNum}`),
    () => search('b', episode, searchName),
    () => search('a', episode, `${searchName} ${epNum}`),
    () => search('a', episode, searchName),
  ]

  const attempt = (index = 0, attempNum = 1) => {
    if (attempNum > MAX_ATTEMPTS && attempts[index + 1]) {
      index = index + 1
      attempNum = 1
    }

    return attempts[index]()
    .then((results) => {
      // QUESTION: what happens w/ 4xx/5xx response

      const shouldTryAgain = (
        attempNum <= MAX_ATTEMPTS &&
        (!results.length || !haveSeeders(results))
      )

      return shouldTryAgain ? attempt(index, attempNum + 1) : results
    })
    .catch((err) => {
      if (attempNum <= MAX_ATTEMPTS) return attempt(index, attempNum + 1)

      throw err
    })
  }

  return attempt()
}

const getLink = (episode) => {
  queue.update({ id: episode.id, state: queue.SEARCHING_TORRENTS })

  const off = () => ipc.off(`cancel:queue:item:${episode.id}`)

  return new Promise((resolve, reject) => {
    searchTorrents(episode)
    .then((results) => resolve(results))
    .catch((error) => reject(error))

    ipc.once(`cancel:queue:item:${episode.id}`, () => {
      queue.update({ id: episode.id, state: queue.CANCELING })
      reject(new util.CancelationError('Canceled searching for torrents'))
    })
  })
  .then((results) => {
    return selectTorrent(episode, results)
  })
  .catch(Promise.TimeoutError, util.wrapHandlingError('Timed out searching for torrents'))
  .catch(util.notCancelationError, util.wrapHandlingError('Error searching for torrents'))
  .finally(off)
}

const download = (episode, directory) => (magnetLink) => {
  return new Promise((resolve, reject) => {
    queue.update({
      id: episode.id,
      state: queue.ADDING_TORRENT,
    })

    let statusPollingId

    webTorrent.on('error', (error) => {
      clearInterval(statusPollingId)
      reject(new util.HandlingError('Error downloading torrent', error.message))
    })

    const torrent = webTorrent.add(magnetLink, { path: directory })

    torrent.on('ready', () => {
      queue.update({
        id: episode.id,
        state: queue.DOWNLOADING_TORRENT,
        info: {
          progress: 0,
          timeRemaining: null,
        },
      })

      statusPollingId = setInterval(() => {
        queue.update({
          id: episode.id,
          info: {
            progress: torrent.progress, // from 0 to 1
            timeRemaining: torrent.timeRemaining, // in milliseconds
          },
        })
      }, 1000)
    })

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
      queue.update({ id: episode.id, state: queue.CANCELING, info: null })
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
  .finally(() => {
    ipc.off(`cancel:queue:item:${episode.id}`)
  })
}

module.exports = {
  getLink,
  download,
}
