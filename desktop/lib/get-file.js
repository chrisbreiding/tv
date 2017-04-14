'use strict'

const _ = require('lodash')
const { dialog } = require('electron')
const path = require('path')
const Promise = require('bluebird')

const glob = Promise.promisify(require('glob'))

const eventBus = require('./event-bus')
const ipc = require('./ipc')
const queue = require('./episode-queue')
const torrent = require('./torrent')
const util = require('./util')

const videoExtensions = ['mkv', 'avi', 'mp4', 'm4v']

const hasVideoExtension = (fileName) => {
  return new RegExp(`(${videoExtensions.join('|')})$`).test(fileName)
}

const selectFile = (episode, directory, filePaths) => {
  const files = _.map(filePaths, (filePath) => ({
    path: filePath,
    relativePath: filePath.replace(directory, ''),
  }))

  queue.update({ id: episode.id, state: queue.SELECT_FILE, items: files })
  eventBus.emit('focus')

  const clear = () => queue.update({ id: episode.id, items: [] })

  return ipc.request('select:file', episode.id)
  .tap(clear)
  .get('path')
  .catch(util.isCancelationError, util.wrapCancelationError('Canceled selecting file'))
  .catch(util.notCancelationError, util.wrapHandlingError('Error selecting file'))
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
      util.matchesEpisodeName(episode, fileName)
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

const downloadFile = (episode) => {
  const directory = util.getDirectories().downloads

  return torrent.getLink(episode)
  .then(torrent.download(episode, directory))
  .then(getFileMatchingEpisode(episode, directory))
}

module.exports = (episode) => ({
  download () { return downloadFile(episode) },
  select () { return getFileFromDisk(episode) },
})
