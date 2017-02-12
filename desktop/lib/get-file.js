'use strict'

const _ = require('lodash')
const { dialog } = require('electron')
const path = require('path')
const Promise = require('bluebird')
const TF = require('teeeff')
const WebTorrent = require('webtorrent')

const glob = Promise.promisify(require('glob'))

const ipc = require('./ipc')
const util = require('./util')

const webTorrent = new WebTorrent()

const videoExtensions = ['mkv', 'avi', 'mp4', 'm4v']
const standardizeName = (name) => name.replace(/[ \'\"\.\-]/g, '').toLowerCase()
const pad = (num) => num < 10 ? `0${num}` : `${num}`

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
    return matchesEpisode(episode, fileName) && !_.includes(fileName, 'sample')
  })

  if (files.length !== 1) {
    throw new Error('No file found')
  } else {
    return files[0]
  }
}

const findFile = (episode, downloadsDirectory) => {
  return glob(`${downloadsDirectory}/**/*.+(${videoExtensions.join('|')})`)
  .then(getFileMatchingEpisode(episode))
}

const promptForFile = (episode, downloadsDirectory) => {
  return new Promise((resolve, reject) => {
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
        // TODO: make this a CancelationError
        reject(util.handlingError(`Canceled handling episode for **${episode.show.displayName}**`, '', 'info'))
      }
    })
  })
}

const getFileFromDisk = (handlers, episode) => {
  const directory = util.getDirectories().downloads

  return findFile(episode, directory)
  .catch(() => {
    return promptForFile(episode, directory)
  })
  .then((filePath) => {
    const otherEpisodeUsingFile = _.find(handlers, { filePath })

    if (otherEpisodeUsingFile) {
      throw util.handlingError(
        `File already in use`,
        `Tried to use *${util.tildeify(filePath)}*\nfor **${episode.fileName}**,\nbut being used for **${otherEpisodeUsingFile.fileName}**`
      )
    } else {
      handlers[episode.id].filePath = filePath
      return filePath
    }
  })
}

const selectTorrent = (torrents) => {
  return ipc.request('select:torrent', torrents)
  .then((torrent) => torrent.magnetLink)
  .catch(util.wrapAndThrowError('User canceled selecting torrent'))
}

const getTorrentLink = (episode) => {
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

    return selectTorrent(matches)
  })
  .catch(util.wrapAndThrowError('Error searching Pirate bay for torrents'))
}

const downloadTorrent = (directory) => (magnetLink) => {
  return new Promise((resolve, reject) => {
    webTorrent.add(magnetLink, { path: directory }, (torrent) => {
      torrent.on('done', () => {
        const filePaths = _.map(torrent.files, 'path')
        console.log('file paths:', filePaths)
        torrent.destroy(() => {
          resolve(filePaths)
        })
      })
    })

    webTorrent.on('error', (error) => {
      reject(util.handlingError('Error downloading torrent', error.message))
    })
  })
}

const downloadFile = (episode) => {
  const directory = util.getDirectories().downloads

  return getTorrentLink(episode)
  .then(downloadTorrent(directory))
  .then(getFileMatchingEpisode(episode))
  .catch(() => {
    return promptForFile(episode, directory)
  })
}

module.exports = (handlers, episode) => ({
  download () { return downloadFile(episode) },
  select () { return getFileFromDisk(handlers, episode) },
})
