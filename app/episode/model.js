import DS from 'ember-data';

let attr = DS.attr;
let recentDaysCutoff = localStorage.recentDaysCutoff || 5;

export default DS.Model.extend({
  season: attr('number'),
  episodeNumber: attr('number'),
  title: attr('string'),
  airdate: attr('date'),

  show: DS.belongsTo('show'),

  fileSafeTitle: function () {
    var title = this.get('title');
    if (title == null) {
      return '';
    }

    return title
      .replace(/[\/]/g, '-')
      .replace(/\:\s+/g, ' - ')
      .replace(/\&/g, 'and')
      .replace(/[\.\!\?\@\#\$\%\^\*\:]/g, '');
  }.property('title'),

  isRecent: function () {
    let airdate = this.get('airdate');
    let startOfiveDaysAgo = moment().subtract(recentDaysCutoff, 'days').startOf('day');
    let startOfToday = moment().startOf('day');
    return moment(airdate).isBetween(startOfiveDaysAgo.subtract(1, 'second'), startOfToday);
  }.property('airdate'),

  isUpcoming: function () {
    let airdate = this.get('airdate');
    let startOfToday = moment().startOf('day');
    return moment(airdate).isAfter(startOfToday.subtract(1, 'second'));
  }.property('airdate'),

  longEpisodeNumber: function () {
    let season = this._toTwoDigits(this.get('season'));
    let episodeNumber = this._toTwoDigits(this.get('episodeNumber'));
    return `s${season}e${episodeNumber}`;
  }.property('season', 'episodeNumber'),

  shortEpisodeNumber: function () {
    return this.get('longEpisodeNumber')
             .replace('s0', '')
             .replace(/[se]/g, '');
  }.property('longEpisodeNumber'),

  _toTwoDigits: function (num) {
    return num < 10 ? `0${num}` : num;
  }
});
