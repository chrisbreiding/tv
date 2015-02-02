import Ember from 'ember';

export default Ember.ArrayController.extend({

  recent: function () {
    return this.filter(function (show) {
      return show.get('episodes').any(function (episode) {
        let airdate = episode.get('airdate');
        let startOfiveDaysAgo = moment().subtract(5, 'days').startOf('day');
        let startOfToday = moment().startOf('day');
        return moment(airdate).isBetween(startOfiveDaysAgo, startOfToday);
      });
    });
  }.property('model.@each'),

  upcoming: function () {
    return this.filter(function (show) {
      return show.get('episodes').any(function (episode) {
        let airdate = episode.get('airdate');
        let startOfToday = moment().startOf('day');
        return moment(airdate).isAfter(startOfToday);
      });
    });
  }.property('model.@each'),

  offair: function () {
    let upcoming = this.get('upcoming');
    return this.reject(function (show) {
      return upcoming.contains(show);
    });
  }.property('upcoming')

});
