const debug = require('debug')('tvapi:shows')
const moment = require('moment')

const { request } = require('./api')
const { convert } = require('./util')

const conversions = [{
  originalProperty: 'id',
  preferredProperty: 'id',
  default: null,
}, {
  originalProperty: 'seriesName',
  preferredProperty: 'name',
  default: null,
}, {
  originalProperty: 'overview',
  preferredProperty: 'description',
  default: null,
}, {
  originalProperty: 'firstAired',
  preferredProperty: 'firstAired',
  default: null,
  transform: (dateString) => dateString && moment(dateString).toISOString(),
}, {
  originalProperty: 'network',
  preferredProperty: 'network',
  default: null,
}, {
  originalProperty: 'banner',
  preferredProperty: 'banner',
  default: null,
  transform: (banner) => banner && `https://www.thetvdb.com/banners/${banner}`,
}, {
  originalProperty: 'status',
  preferredProperty: 'status',
  default: 'ended',
  transform: (status) => status.toLowerCase(),
}]

const searchShows = (showName) => {
  debug('search for', showName)

  return request({
    url: 'search/series',
    qs: { name: showName },
  })
  .get('data')
  .then(convert(conversions))
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log(`Searching ${showName} failed:`, error.stack)
  })
}

const getShowsUpdatedSince = (date) => {
  debug('find shows updated since', date)

  return request({
    url: 'updated/query',
    qs: { fromTime: moment(date).unix() },
  })
  .get('data')
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log(`Getting shows updated since ${date} failed:`, error.stack)
  })
}

module.exports = {
  searchShows,
  getShowsUpdatedSince,
}
