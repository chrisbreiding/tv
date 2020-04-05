const debug = require('debug')('tvapi:episodes')
const moment = require('moment')
const { request } = require('./api')
const { convert } = require('./util')

const conversions = [{
  originalProperty: 'airedSeason',
  preferredProperty: 'season',
  default: '0',
  transform: (numberString) => Number(numberString),
}, {
  originalProperty: 'airedEpisodeNumber',
  preferredProperty: 'episodeNumber',
  default: '0',
  transform: (numberString) => Number(numberString),
}, {
  originalProperty: 'episodeName',
  preferredProperty: 'title',
  default: null,
}, {
  originalProperty: 'firstAired',
  preferredProperty: 'airdate',
  default: null,
  transform: (dateString) => dateString && moment(dateString).toISOString(),
}, {
  originalProperty: 'overview',
  preferredProperty: 'description',
  default: null,
}]

const getAllEpisodesForShow = (showId, token, page = 1, prevEpisodes = []) => {
  debug('get episodes for show id %s, page id: %i, total previous: %i', showId, page, prevEpisodes.length)

  return request({
    url: `series/${showId}/episodes`,
    qs: {
      page,
    },
    token,
  })
  .then(({ data, links, token }) => {
    const episodes = prevEpisodes.concat(data)

    if (page === links.last || page === links.next || links.next == null) {
      return episodes
    }

    return getAllEpisodesForShow(showId, token, links.next, episodes)
  })
}

const getEpisodesForShow = (showId) => {
  debug('get episodes for show id', showId)

  return getAllEpisodesForShow(showId)
  .then(convert(conversions))
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log(`Getting episodes for show id ${showId} failed:`, error.stack)
  })
}

module.exports = {
  getEpisodesForShow,
}
