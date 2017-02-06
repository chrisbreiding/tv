'use strict'

const _ = require('lodash')
const { dialog } = require('electron')
const path = require('path')
const Promise = require('bluebird')

const glob = Promise.promisify(require('glob'))

const util = require('./util')

const videoExtensions = ['mkv', 'avi', 'mp4', 'm4v']
const standardizeName = (name) => name.replace(/[ \'\"\.\-]/g, '').toLowerCase()
const pad = (num) => num < 10 ? `0${num}` : `${num}`

const findFile = (episode, downloadsDirectory) => {
  return glob(`${downloadsDirectory}/**/*.+(${videoExtensions.join('|')})`)
  .then((filePaths) => {
    if (!filePaths.length) {
      throw new Error('No file found')
    }

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

    const files = _.filter(filePaths, (filePath) => {
      const fileName = standardizeName(path.basename(filePath))
      return (
        _.includes(fileName, showName)
        && _.some(seasonAndEpisodes, _.partial(_.includes, fileName))
      )
    })

    if (files.length !== 1) {
      throw new Error('No file found')
    } else {
      return files[0]
    }
  })
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
        reject(util.handlingError(`Canceled handling episode for **${episode.show.displayName}**`, '', 'info'))
      }
    })
  })
}

module.exports = (handlers, episode) => () => {
  const directories = util.getDirectories()

  return findFile(episode, directories.downloads)
  .catch(() => {
    return promptForFile(episode, directories.downloads)
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
