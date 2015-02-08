import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'li',
  classNames: ['episode-single'],
  classNameBindings: ['airdateStatus'],

  airdateStatus: function () {
    let airdate = moment(this.get('episode.airdate'));
    return this._isToday(airdate)     ? 'today upcoming' :
           this._isFarPast(airdate)   ? 'far-past' :
           this._isPast(airdate)      ? 'past' :
           this._isRecent(airdate)    ? 'recent' :
           this._isFarFuture(airdate) ? 'far-future' :
           this._isFuture(airdate)    ? 'future' :
                                        'upcoming';
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
