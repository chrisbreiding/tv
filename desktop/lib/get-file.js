'use strict'

const _ = require('lodash')
const { dialog } = require('electron')
const path = require('path')
const Promise = require('bluebird')
const TF = require('teeeff')
const trash = require('trash')
const WebTorrent = require('webtorrent')

const glob = Promise.promisify(require('glob'))

const eventBus = require('./event-bus')
const ipc = require('./ipc')
const queue = require('./episode-queue')
const util = require('./util')

const webTorrent = new WebTorrent()

const focusApp = () => {
  eventBus.emit('focus')
}

const notCancelationError = (error) => !error.isCancellationError

const videoExtensions = ['mkv', 'avi', 'mp4', 'm4v']
const standardizeName = (name) => name.replace(/[ \'\"\.\-]/g, '').toLowerCase()
const pad = (num) => num < 10 ? `0${num}` : `${num}`

const hasVideoExtension = (fileName) => {
  return new RegExp(`(${videoExtensions.join('|')})$`).test(fileName)
}

const selectFile = (episode, directory, filePaths) => {
  const files = _.map(filePaths, (filePath) => ({
    path: filePath,
    relativePath: filePath.replace(directory, ''),
  }))

  queue.update({ id: episode.id, state: queue.SELECT_FILE, items: files })
  focusApp()

  const clear = () => queue.update({ id: episode.id, items: [] })

  return ipc.request('select:file', episode.id)
  .tap(clear)
  .get('path')
  .catch({ message: 'cancel' }, util.wrapCancelationError('Canceled selecting file'))
  .catch(notCancelationError, util.wrapHandlingError('Error selecting file'))
}

const matchesEpisode = (episode, name) => {
  name = standardizeName(name)
  const showName = standardizeName(episode.show.searchName)
  const season = episode.season
  const epNum = episode.episode_number
  const paddedSeason = pad(season)
  const paddedEpNum = pad(epNum)
  const seasonAndEpisodes = [
    `${season}${epNum}`,
    `${season}${paddedEpNum}`,
    `${paddedSeason}${paddedEpNum}`,
    `s${season}e${epNum}`,
    `s${season}e${paddedEpNum}`,
    `s${paddedSeason}e${paddedEpNum}`,
  ]

  return (
    _.includes(name, showName) &&
    _.some(seasonAndEpisodes, _.partial(_.includes, name))
  )
}

const promptForFile = (episode, directory) => {
  return new Promise((resolve, reject) => {
    dialog.showOpenDialog({
      title: 'Select Episode Video File',
      buttonLabel: 'Select',
      defaultPath: directory,
      filters: [
        { name: 'Movies', extensions: videoExtensions },
      ],
    }, (filePaths) => {
      if (filePaths && filePaths[0]) {
        resolve(filePaths[0])
      } else {
        reject(new util.CancelationError(`Canceled selecting video file`))
      }
    })
  })
}

const getFileMatchingEpisode = (episode, directory) => (filePaths = []) => {
  const matchingFilePaths = _.filter(filePaths, (filePath) => {
    const fileName = path.basename(filePath)
    return (
      !_.includes(fileName, 'sample') &&
      hasVideoExtension(fileName) &&
      matchesEpisode(episode, fileName)
    )
  })

  if (matchingFilePaths.length === 1) {
    return matchingFilePaths[0]
  } else if (!matchingFilePaths.length) {
    return promptForFile(episode, directory)
  } else {
    return selectFile(episode, directory, matchingFilePaths)
  }
}

const getVideoFiles = (episode, downloadsDirectory) => {
  return glob(`${downloadsDirectory}/**/*.+(${videoExtensions.join('|')})`, {
    nocase: true,
    nodir: true,
  })
}

const getFileFromDisk = (episode) => {
  const directory = util.getDirectories().downloads

  return getVideoFiles(episode, directory)
  .then(getFileMatchingEpisode(episode, directory))
  .then((filePath) => {
    const otherEpisodeUsingFile = queue.find({ filePath })

    if (otherEpisodeUsingFile) {
      throw new util.HandlingError(
        `File already in use`,
        `Tried to use *${util.tildeify(filePath)}*\nfor **${episode.fileName}**,\nbut being used for **${otherEpisodeUsingFile.fileName}**`
      )
    } else {
      queue.update({ id: episode.id, filePath })
      return filePath
    }
  })
}

const selectTorrent = (episode, torrents) => {
  queue.update({ id: episode.id, state: queue.SELECT_TORRENT, items: torrents })
  focusApp()

  const clear = () => queue.update({ id: episode.id, items: [] })

  return ipc.request('select:torrent', episode.id)
  .tap(clear)
  .get('magnetLink')
  .catch({ message: 'cancel' }, util.wrapCancelationError('Canceled selecting torrent'))
  .catch(notCancelationError, util.wrapHandlingError('Error selecting torrent'))
}

const getTorrentLink = (episode) => {
  queue.update({ id: episode.id, state: queue.SEARCHING_TORRENTS })

  return new Promise((resolve, reject) => {
    TF.search(episode.show.searchName, {
      category: '205', // TV Shows
      orderBy: 'date',
      sortBy: 'desc',
      filter: { verified: false },
    })
    .then((results) => resolve(results))
    .catch((error) => reject(error))

    ipc.once(`cancel:queue:item:${episode.id}`, () => {
      queue.update({ id: episode.id, state: queue.CANCELING })
      reject(new util.CancelationError('Canceled searching for torrents'))
    })
  })
  .timeout(10000)
  .then((results) => {
    let matches = _(results)
      .filter((result) => matchesEpisode(episode, result.name))
      .sortBy((result) => Number(result.seeders))
      .reverse()
      .value()

    if (matches.length) {
      if (Number(matches[0].seeders) > 100) {
        return matches[0].magnetLink
      }
    } else {
      matches = results
    }

    if (!matches.length) {
      throw new util.HandlingError('Could not find any torrents for episode')
    }

    return selectTorrent(episode, matches)
  })
  .catch(Promise.TimeoutError, util.wrapHandlingError('Timed out searching for torrents'))
  .catch(notCancelationError, util.wrapHandlingError('Error searching for torrents'))
  .finally(() => {
    ipc.off(`cancel:queue:item:${episode.id}`)
  })
}

const downloadTorrent = (episode, directory) => (magnetLink) => {
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

const downloadFile = (episode) => {
  const directory = util.getDirectories().downloads

  return getTorrentLink(episode)
  .then(downloadTorrent(episode, directory))
  .then(getFileMatchingEpisode(episode, directory))
}

module.exports = (episode) => ({
  download () { return downloadFile(episode) },
  select () { return getFileFromDisk(episode) },
})
