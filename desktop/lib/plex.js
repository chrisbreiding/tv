const _ = require('lodash')
const os = require('os')
const PlexAPI = require("plex-api")
const Promise = require('bluebird')

const ipc = require('./ipc')
const util = require('./util')

const version = require('../package.json').version

const getPlexCredentials = () => {
  return ipc.request('get:plex:credentials')
}

const getApiClient = () => {
  const options = {
    hostname: os.hostname(),
    options: {
      identifier: 'com.chrisbreiding.tv.desktop',
      deviceName: util.appName,
      version,
      product: (os.hostname() || '').replace('.local', ''),
      device: `OSX ${os.release()}`,
    },
  }

  const token = util.getPlexToken()

  if (token) {
    options.token = token
    return Promise.resolve(new PlexAPI(options))
  }

  return getPlexCredentials()
  .then(({ authToken }) => {
    util.setPlexToken(authToken)
    options.token = authToken
    return new PlexAPI(options)
  })
}

const refresh = () => {
  return getApiClient()
  .then((apiClient) => {
    return apiClient.query("/library/sections")
    .then((response) => {
      const directory = _.find(response.MediaContainer.Directory, { type: 'show' })

      if (directory) {
        return apiClient.perform(`/library/sections/${directory.key}/refresh`)
      } else {
        throw new Error('Could not find TV Shows library')
      }
    })
  })
  .catch(util.isCancelationError, util.wrapCancelationError(''))
  .catch({ code: 'ECONNREFUSED' }, () => {
    throw new Error('Plex does not appear to be running. Make sure Plex Media Server is open and running on your computer.')
  })
  .catch(util.notCancelationError, (error) => {
    throw new util.HandlingError('Failed to refresh Plex', error.message)
  })
}

module.exports = {
  refresh,
}
