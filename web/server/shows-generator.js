var _ = require('lodash')
var moment = require('moment')
var textGen = require('./text-generator')

var showId = 0
var episodeId = 0

module.exports = {
  incShowId: function () {
    return ++showId
  },

  incEpisodeId: function () {
    return ++episodeId
  },

  showsAndEpisodes: function (numShows) {
    var episodes = []
    var shows = _.map(_.range(numShows), function () {
      var generation = this.showAndEpisodes(this.incShowId())
      episodes = episodes.concat(generation.episodes)
      return generation.show
    }.bind(this))

    return {
      shows: shows,
      episodes: episodes
    }
  },

  showAndEpisodes: function (id) {
    var episodes = this.seasons(_.random(4, 14))
    var name = textGen(1, 3)
    return {
      show: {
        id: id,
        display_name: name,
        search_name: name + ' s',
        file_name: name + ' f',
        source_id: '' + _.random(20),
        episode_ids: _.map(episodes, 'id')
      },
      episodes: episodes
    }
  },

  seasons: function (num) {
    var startDate = this._highChance()  ? this._offAirStartDate() :
                    this._quarterChance() ? this._todayStartDate()  :
                    this._quarterChance() ? this._recentStartDate() :
                    this._randomStartDate()
    return _.flatten(_.map(_.shuffle(_.range(num)), function (season) {
      return this._episodes(_.random(24, 36), season, startDate.subtract(1, 'week'))
    }.bind(this)))
  },

  _highChance: function () {
    return !!_.random(0, 5)
  },

  _halfChance: function () {
    return !_.random(0, 1)
  },

  _quarterChance: function () {
    return !_.random(0, 3)
  },

  _eighthChance: function () {
    return !_.random(0, 7)
  },

  _randomStartDate: function () {
    return moment().subtract(_.random(0, 100), 'days')
  },

  _todayStartDate: function () {
    return moment()
  },

  _recentStartDate: function () {
    return moment().subtract(2, 'days')
  },

  _offAirStartDate: function () {
    return moment().subtract(5, 'years')
  },

  _episodes: function (num, season, airdate) {
    var epNum = 1
    return _.shuffle(_.map(_.range(num), function () {
      return this._episode(this.incEpisodeId(),
                          season,
                          epNum++,
                          airdate.add(1, 'week'))
    }.bind(this)))
  },

  _episode: function (id, season, epNum, airdate) {
    var oddChars = '.!?@#$%^*:-&\\/'.split('')
    var withOddChars = textGen(3, 5).replace(' ', ' ' + oddChars[_.random(0, oddChars.length)] + ' ')
    var title = this._eighthChance() ? withOddChars :
                this._eighthChance() ? null         :
                textGen(1, 5)
    return {
      id: id,
      season: season,
      number: epNum,
      title: title,
      airdate: airdate.startOf('day').toISOString()
    }
  }
}
