'use strict'

const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs-extra'))

const util = require('./util')

const directoryError = (name) => {
  return new util.HandlingError(`Error handling episode: must set **${name}** directory`)
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
  .catch(util.wrapHandlingError(`The ${name} directory, **${directoryPath}**, does not exist`))
  .then((stats) => {
    if (!stats.isDirectory()) {
      throw new util.HandlingError(`The ${name} directory, **${directoryPath}**, is not a directory`)
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

module.exports = () => {
  const directories = util.getDirectories()

  return verifyBaseDirectoriesSet(directories)
         .then(verifyBaseDirectoriesExist(directories))
}
