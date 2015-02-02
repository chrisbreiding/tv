import DS from 'ember-data';

let attr = DS.attr;

export default DS.Model.extend({
  season: attr('number'),
  episode_number: attr('number'),
  title: attr('string'),
  airdate: attr('date'),

  show: DS.belongsTo('show'),

  longEpisodeNumber: function () {
    let season = this._toTwoDigits(this.get('season'));
    let episodeNumber = this._toTwoDigits(this.get('episode_number'));
    return `s${season}e${episodeNumber}`;
  }.property('season', 'episode_number'),

  shortEpisodeNumber: function () {
    return this.get('longEpisodeNumber')
             .replace('s0', '')
             .replace(/[se]/g, '');
  }.property('longEpisodeNumber'),

  displayDate: function () {
    return moment(this.get('airdate')).format('MM-DD-YY');
  }.property('airdate'),

  _toTwoDigits: function (num) {
    return num < 10 ? `0${num}` : num;
  }
});
