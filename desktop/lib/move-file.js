'use strict'

const path = require('path')
const Promise = require('bluebird')
const sanitize = require('sanitize-filename')
const trash = require('trash')

const fs = Promise.promisifyAll(require('fs-extra'))

const queue = require('./episode-queue')
const util = require('./util')

const ensureSeasonDirectory = (episode, directories, filePath) => {
  const newDirectory = path.join(directories.tvShows, episode.show.fileName, `Season ${episode.season}`)
  return fs.ensureDirAsync(newDirectory)
    .return([filePath, newDirectory])
    .catch(util.wrapHandlingError(`Failed to make directory *${util.tildeify(newDirectory)}*`))
}

const copyFile = (episode) => ([filePath, newDirectory]) => {
  queue.update(episode.id, { state: queue.COPYING_FILE })

  const extension = path.extname(filePath)
  const newFileName = sanitize(episode.fileName)
  const newFilePath = path.join(newDirectory, `${newFileName}${extension}`)

  return fs.renameAsync(filePath, newFilePath)
  .return([filePath, newFilePath])
  .catch((error) => {
    throw new util.HandlingError(
      `Error copying file`,
      `Failed to move *${util.tildeify(filePath)}*\nto\n*${util.tildeify(newFilePath)}*\n\n${error.message}`
    )
  })
}

const trashOriginal = (episode, directories) => ([filePath, newFilePath]) => {
  queue.update(episode.id, { state: queue.TRASHING_TORRENT_FILES })

  // assumes file will only ever be in downloads or one level deep
  let toDelete = path.dirname(filePath)
  if (toDelete === directories.downloads) {
    toDelete = filePath
  }
  return Promise.resolve(trash([toDelete]))
  .return([filePath, newFilePath])
  .catch(util.wrapHandlingError(`Error removing *${util.tildeify(toDelete)}*`))
}

module.exports = (episode) => (filePath) => {
  const directories = util.getDirectories()

  return ensureSeasonDirectory(episode, directories, filePath)
  .then(copyFile(episode))
  .then(trashOriginal(episode, directories))
}
