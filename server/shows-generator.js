var _ = require('lodash');
var moment = require('moment');
var textGen = require('./text-generator');

var showId = 0;
var episodeId = 0;

module.exports = {
  incShowId: function () {
    return ++showId;
  },

  incEpisodeId: function () {
    return ++episodeId;
  },

  show: function (id) {
    var episodes = this.seasons(_.random(2, 8));
    var name = textGen(1, 3);
    return {
      show: {
        id: '' + id,
        display_name: name,
        search_name: name + ' s',
        file_name: name + ' f',
        source_id: '' + _.random(20),
        episodes: _.pluck(episodes, 'id')
      },
      episodes: episodes
    }
  },

  seasons: function (num) {
    var startDate = this._quarterChance() ? this._offAirStartDate() : this._randomStartDate();
    return _.flatten(_.map(_.range(1, num), function (season) {
      return this._episodes(_.random(1, 8), season, startDate);
    }.bind(this)));
  },

  _coinFlip: function () {
    return !!_.random(0, 1);
  },

  _quarterChance: function () {
    return !_.random(0, 3);
  },

  _randomStartDate: function () {
    var method = this._coinFlip() ? 'add' : 'subtract';
    return moment()[method](_.random(0, 50), 'days').subtract(1, 'week');
  },

  _offAirStartDate: function () {
    return moment().subtract(2, 'years');
  },

  _episodes: function (num, season, airdate) {
    var epNum = 1;
    return _.map(_.range(num), function () {
      return this._episode(this.incEpisodeId(),
                          season,
                          epNum++,
                          airdate.add(1, 'week'));
    }.bind(this));
  },

  _episode: function (id, season, epNum, airdate) {
    return {
      id: '' + id,
      season: season,
      episode_number: epNum,
      title: textGen(1, 5),
      airdate: airdate.toISOString()
    }
  }
}
