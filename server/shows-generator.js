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
    var episodes = this.episodes(_.random(1, 8));
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

  episodes: function (num) {
    var season = _.random(1, 8);
    var epNum = _.random(1, 5);
    var method = _.random(0, 1) ? 'add' : 'subtract';
    var airdate =  moment()[method](_.random(0, 50), 'days').subtract(1, 'week');
    return _.map(_.range(num), function () {
      return this.episode(this.incEpisodeId(),
                          season,
                          epNum++,
                          airdate.add(1, 'week'));
    }.bind(this));
  },

  episode: function (id, season, epNum, airdate) {
    return {
      id: '' + id,
      season: season,
      episode_number: epNum,
      title: textGen(1, 5),
      airdate: airdate.toISOString()
    }
  }
}
