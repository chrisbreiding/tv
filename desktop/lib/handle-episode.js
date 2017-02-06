'use strict'

const _ = require('lodash')
const { dialog } = require('electron')
const path = require('path')
const PlexAPI = require("plex-api")
const promisePipe = require("promisepipe")
const Promise = require('bluebird')
const sanitize = require('sanitize-filename')
const trash = require('trash')

const glob = Promise.promisify(require('glob'))
const fs = Promise.promisifyAll(require('fs-extra'))

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

const handlingError = (title, message = '', type = 'error') => {
  const error = new Error()
  error.isHandlingError = true
  error.title = title
  error.message = message
  error.type = type
  return error
}

const wrapAndThrowError = (title, type) => (error) => {
  throw handlingError(title, error.message, type)
}

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
        reject(handlingError(`Canceled handling episode for **${episode.show.displayName}**`, '', 'info'))
      }
    })
  })
}

const getFile = (episode, directories) => () => {
  return findFile(episode, directories.downloads)
  .catch(() => {
    return promptForFile(episode, directories.downloads)
  })
  .then((filePath) => {
    const otherEpisodeUsingFile = _.find(handlers, { filePath })

    if (otherEpisodeUsingFile) {
      throw handlingError(
        `File already in use`,
        `Tried to use *${util.tildeify(filePath)}*\nfor **${episode.fileName}**,\nbut being used for **${otherEpisodeUsingFile.fileName}**`
      )
    } else {
      handlers[episode.id].filePath = filePath
      return filePath
    }
  })
}

const directoryError = (name) => {
  return handlingError(`Error handling episode: must set **${name}** directory`)
}

const verifyBaseDirectoriesSet = (directories) => {
  const errors = new Promise.AggregateError()

  if (!directories.downloads) errors.push(directoryError('Downloads'))
  if (!directories.tvShows) errors.push(directoryError('TV Shows'))

  if (errors.length) {
    return Promise.reject(errors)
  } else {
    return Promise.resolve()
  }
}

const directoryExists = (directoryPath, name) => {
  return fs.statAsync(directoryPath)
  .catch(() => {
    throw handlingError(`The ${name} directory, **${directoryPath}**, does not exist`)
  })
  .then((stats) => {
    if (!stats.isDirectory()) {
      throw handlingError(`The ${name} directory, **${directoryPath}**, is not a directory`)
    }
  })
}

const verifyBaseDirectoriesExist = (directories) => () => {
  const errors = new Promise.AggregateError()
  return Promise.all([
    directoryExists(directories.downloads, 'Downloads').catch((error) => {
      errors.push(error)
      throw error
    }),
    directoryExists(directories.tvShows, 'TV Shows').catch((error) => {
      errors.push(error)
      throw error
    }),
  ])
  .catch(() => {
    throw errors
  })
}

const ensureSeasonDirectory = (episode, directories) => (filePath) => {
  const newDirectory = path.join(directories.tvShows, episode.show.fileName, `Season ${episode.season}`)
  return fs.ensureDirAsync(newDirectory)
    .return([filePath, newDirectory])
    .catch(wrapAndThrowError(`Failed to make directory *${util.tildeify(newDirectory)}*`))
}

const copyFile = (episode) => ([filePath, newDirectory]) => {
  const extension = path.extname(filePath)
  const newFileName = sanitize(episode.fileName)
  const newFilePath = path.join(newDirectory, `${newFileName}${extension}`)

  const copy = promisePipe(
    fs.createReadStream(filePath),
    fs.createWriteStream(newFilePath)
  )

  return Promise.resolve(copy)
  .return([filePath, newFilePath])
  .catch((error) => {
    throw handlingError(
      `Error copying file`,
      `Failed to move *${util.tildeify(filePath)}*\nto\n*${util.tildeify(newFilePath)}*\n\n${error.message}`
    )
  })
}

const trashOriginal = (directories) => ([filePath, newFilePath]) => {
  // assumes file will only ever be in downloads or one level deep
  let toDelete = path.dirname(filePath)
  if (toDelete === directories.downloads) {
    toDelete = filePath
  }
  return Promise.resolve(trash([toDelete]))
  .return([filePath, newFilePath])
  .catch(wrapAndThrowError(`Error removing *${util.tildeify(toDelete)}*`))
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

  const directories = util.getDirectories()

  handlers[episode.id] = episode
  sendHandlingNotice(episode, true)

  verifyBaseDirectoriesSet(directories)
  .then(verifyBaseDirectoriesExist(directories))
  .then(getFile(episode, directories))
  .then(ensureSeasonDirectory(episode, directories))
  .then(copyFile(episode))
  .then(trashOriginal(directories))
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
