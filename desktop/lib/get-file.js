'use strict'

const _ = require('lodash')
const { dialog } = require('electron')
const path = require('path')
const Promise = require('bluebird')
const TF = require('teeeff')
const WebTorrent = require('webtorrent')

const glob = Promise.promisify(require('glob'))

const ipc = require('./ipc')
const queue = require('./episode-queue')
const util = require('./util')

const webTorrent = new WebTorrent()

const videoExtensions = ['mkv', 'avi', 'mp4', 'm4v']
const standardizeName = (name) => name.replace(/[ \'\"\.\-]/g, '').toLowerCase()
const pad = (num) => num < 10 ? `0${num}` : `${num}`

const hasVideoExtension = (fileName) => {
  return new RegExp(`(${videoExtensions.join('|')})$`).test(fileName)
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

const getFileMatchingEpisode = (episode) => (filePaths) => {
  if (!filePaths.length) {
    throw new Error('No file found')
  }

  const files = _.filter(filePaths, (filePath) => {
    const fileName = path.basename(filePath)
    return (
      !_.includes(fileName, 'sample') &&
      hasVideoExtension(fileName) &&
      matchesEpisode(episode, fileName)
    )
  })

  if (files.length === 1) {
    return files[0]
  } else {
    throw new Error('No file found')
  }
}

const findFile = (episode, downloadsDirectory) => {
  return glob(`${downloadsDirectory}/**/*.+(${videoExtensions.join('|')})`, {
    nocase: true,
    nodir: true,
  })
  .then(getFileMatchingEpisode(episode))
}

const promptForFile = (episode, downloadsDirectory) => {
  return new Promise((resolve, reject) => {
    queue.update(episode.id, { state: queue.USER_SELECTING_FILE })

    dialog.showOpenDialog({
      title: 'Select Show',
      buttonLabel: 'Select',
      defaultPath: downloadsDirectory,
      filters: [
        { name: 'Movies', extensions: videoExtensions },
      ],
    }, (filePaths) => {
      if (filePaths && filePaths[0]) {
        resolve(filePaths[0])
      } else {
        reject(new util.CancelationError(`Canceled handling episode for **${episode.show.displayName}**`))
      }
    })
  })
}

const getFileFromDisk = (episode) => {
  const directory = util.getDirectories().downloads

  return findFile(episode, directory)
  .catch(() => {
    return promptForFile(episode, directory)
  })
  .then((filePath) => {
    const otherEpisodeUsingFile = queue.find({ filePath })

    if (otherEpisodeUsingFile) {
      throw new util.HandlingError(
        `File already in use`,
        `Tried to use *${util.tildeify(filePath)}*\nfor **${episode.fileName}**,\nbut being used for **${otherEpisodeUsingFile.fileName}**`
      )
    } else {
      queue.update(episode.id, { filePath })
      return filePath
    }
  })
}

const selectTorrent = (episode, torrents) => {
  queue.update(episode.id, { state: queue.USER_SELECTING_TORRENT })

  return ipc.request('select:torrent', torrents)
  .then((torrent) => torrent.magnetLink)
  .catch(util.wrapCancelationError('Canceled selecting torrent'))
}

const getTorrentLink = (episode) => {
  queue.update(episode.id, { state: queue.SEARCHING_TORRENTS })

  const search = TF.search(episode.show.searchName, {
    category: '205', // TV Shows
    orderBy: 'date',
    sortBy: 'desc',
    filter: { verified: false },
  })

  return Promise.resolve(search)
  .timeout(10000)
  .then((results) => {
    let matches = _(results)
      .filter((result) => {
        return matchesEpisode(episode, result.name)
      })
      .sortBy((result) => Number(result.seeders))
      .reverse()
      .value()

    if (matches.length) {
      if (Number(matches[0].seeders) > 100) {
        return Promise.resolve(matches[0].magnetLink)
      }
    } else {
      matches = results
    }

    return selectTorrent(episode, matches)
  })
  .catch(Promise.TimeoutError, util.wrapHandlingError('Timed out searching for torrents'))
  .catch(util.wrapHandlingError('Error searching for torrents'))
}

const downloadTorrent = (episode, directory) => (magnetLink) => {
  return new Promise((resolve, reject) => {
    queue.update(episode.id, {
      state: queue.DOWNLOADING_TORRENT,
      info: {
        progress: 0,
        timeRemaining: null,
      },
    })

    webTorrent.add(magnetLink, { path: directory }, (torrent) => {
      const statusPollingId = setInterval(() => {
        queue.update(episode.id, {
          info: {
            progress: torrent.progress, // from 0 to 1
            timeRemaining: torrent.timeRemaining, // in milliseconds
          },
        })
      }, 1000)

      torrent.on('done', () => {
        clearInterval(statusPollingId)
        queue.update(episode.id, { state: queue.REMOVING_TORRENT, info: null })
        const filePaths = _.map(torrent.files, (file) => {
          return path.join(directory, file.path)
        })
        torrent.destroy(() => {
          resolve(filePaths)
        })
      })

      torrent.on('error', (error) => {
        reject(new util.HandlingError('Error downloading torrent', error.message))
      })
    })

    webTorrent.on('error', (error) => {
      reject(new util.HandlingError('Error downloading torrent', error.message))
    })
  })
}

const downloadFile = (episode) => {
  const directory = util.getDirectories().downloads

  return getTorrentLink(episode)
  .then(downloadTorrent(episode, directory))
  .then(getFileMatchingEpisode(episode))
  .catch(() => {
    return promptForFile(episode, directory)
  })
}

module.exports = (episode) => ({
  download () { return downloadFile(episode) },
  select () { return getFileFromDisk(episode) },
})
