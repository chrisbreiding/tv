import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'li',
  classNames: ['episode-single'],
  classNameBindings: ['airdateStatus'],

  airdateStatus: function () {
    let airdate = moment(this.get('episode.airdate'));
    if (this._isToday(airdate)) {
      return 'today upcoming';
    } else if (this._isFarPast(airdate)) {
      return 'far-past';
    } else if (this._isPast(airdate)) {
      return 'past';
    } else if (this._isRecent(airdate)) {
      return 'recent';
    } else if (this._isFarFuture(airdate)) {
      return 'far-future';
    } else if (this._isFuture(airdate)) {
      return 'future';
    } else {
      return 'upcoming';
    }
  }.property('episode.airdate'),

  _isToday(date) {
    return date.isSame(moment(), 'day');
  },

  _isFarPast(date) {
    return date.isBefore(moment().subtract(2, 'months'), 'day');
  },

  _isPast(date) {
    return date.isBefore(moment().subtract(5, 'days'), 'day');
  },

  _isRecent(date) {
    return date.isBefore(moment(), 'day');
  },

  _isFarFuture(date) {
    return date.isAfter(moment().add(2, 'months'), 'day');
  },

  _isFuture(date) {
    return date.isAfter(moment().add(1, 'month'), 'day');
  }

});
