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

const plex = new PlexAPI('MBP13.local')

const ipc = require('./ipc')
const util = require('./util')

const sendHandlingNotice = (isHandling) => {
  ipc.send('handling:episode', isHandling)
}

const sendNotification = (notification) => {
  ipc.send('notification', notification)
}

const handlingError = (title, message, type = 'error') => {
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
    const seasonAndEpisode = `s${pad(episode.season)}e${pad(episode.episode_number)}`

    const files = _.filter(filePaths, (filePath) => {
      const fileName = standardizeName(path.basename(filePath))
      return (
        fileName.indexOf(showName) > -1
        && fileName.indexOf(seasonAndEpisode) > -1
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
}

const ensureBaseDirectories = (directories) => {
  let directoriesSet = true

  if (!directories.downloads) {
    directoriesSet = false
    sendNotification({
      title: 'Error handling episode: must set **Downloads** directory',
      type: 'error',
    })
  }

  if (!directories.tvShows) {
    directoriesSet = false
    sendNotification({
      title: 'Error handling episode: must set **TV Shows** directory',
      type: 'error',
    })
  }

  if (directoriesSet) {
    return Promise.resolve()
  } else {
    return Promise.reject(handlingError(''))
  }
}

const ensureSeasonDirectory = (episode, directories) => (filePath) => {
  const newDirectory = path.join(directories.tvShows, episode.show.fileName, `Season ${episode.season}`)
  return fs.ensureDirAsync(newDirectory)
    .return([filePath, newDirectory])
    .catch(wrapAndThrowError(`Failed to make directory **${util.tildeify(newDirectory)}**`))
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
      `Failed to move **${util.tildeify(filePath)}**\nto\n**${util.tildeify(newFilePath)}**\n\n${error.message}`
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
  .catch(wrapAndThrowError(`Error removing **${util.tildeify(toDelete)}**`))
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

const notifySuccess = (episode) => ([filePath, newFilePath]) => {
  sendNotification({
    title: `Finished handling episode for **${episode.show.displayName}**`,
    message: `**${util.tildeify(filePath)}**\n  renamed and moved to\n**${util.tildeify(newFilePath)}**`,
    type: 'success',
  })
  sendHandlingNotice(false)
  return refreshPlex()
}

const notifyError = (episode) => (error) => {
  let notification = error
  if (!notification.isHandlingError) {
    notification = new Error()
    notification.title = 'Unexpected error while handling episode'
    notification.message = `${episode.fileName}\n\n${error.stack}`
    notification.type = 'error'
  }
  if (notification.title) {
    ipc.send('notification', notification)
  }

  sendHandlingNotice(false)
}

module.exports = (episode) => {
  const directories = util.getDirectories()

  sendHandlingNotice(true)

  ensureBaseDirectories(directories)
  .then(getFile(episode, directories))
  .then(ensureSeasonDirectory(episode, directories))
  .then(copyFile(episode))
  .then(trashOriginal(directories))
  .then(notifySuccess(episode))
  .catch(notifyError(episode))
}
