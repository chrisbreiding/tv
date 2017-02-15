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

const selectFile = (episode, directory, filePaths) => {
  queue.update(episode.id, { state: queue.SELECT_FILE })

  const files = _.map(filePaths, (filePath) => ({
    path: filePath,
    relativePath: filePath.replace(directory, ''),
  }))

  return ipc.request('select:file', episode.id, files)
  .then((file) => file.path)
  .catch(util.wrapCancelationError('Canceled selecting file'))
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
  if (!filePaths.length) {
    return promptForFile(episode, directory)
  }

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
      queue.update(episode.id, { filePath })
      return filePath
    }
  })
}

const selectTorrent = (episode, torrents) => {
  queue.update(episode.id, { state: queue.SELECT_TORRENT })

  return ipc.request('select:torrent', episode.id, torrents)
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
  .then(getFileMatchingEpisode(episode, directory))
}

module.exports = (episode) => ({
  download () { return downloadFile(episode) },
  select () { return getFileFromDisk(episode) },
})
