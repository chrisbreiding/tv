const Promise = require('bluebird')
const debug = require('debug')('tvapi:api')
const rp = require('request-promise')

const API_KEY = 'B371EB52E524C1F4'

const baseUrl = 'https://api.thetvdb.com'

const authenticate = (options) => {
  if (options.token) {
    return Promise.resolve(options.token)
  }

  debug('authenticate')

  return rp({
    method: 'POST',
    uri: `${baseUrl}/login`,
    body: {
      apiKey: API_KEY,
    },
    json: true,
  })
  .promise()
  .get('token')
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Authentication failed:', error.stack)
  })
}

const request = (options) => {
  return authenticate(options)
  .then((token) => {
    const url = `${baseUrl}/${options.url}`

    debug('request %s, %o', url, options)

    return rp(Object.assign({}, options, {
      url,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      json: true,
    }))
    .then((result) => {
      result.token = token

      return result
    })
  })
}

module.exports = {
  request,
}
