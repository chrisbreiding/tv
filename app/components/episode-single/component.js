import Ember from 'ember';
import date from '../../utils/date';

export default Ember.Component.extend({

  tagName: 'li',
  classNames: ['episode-single'],
  classNameBindings: ['airdateStatus'],

  airdateStatus: function () {
    let airdate = moment(this.get('episode.airdate'));
    return date.isToday(airdate)     ? 'today upcoming' :
           date.isFarPast(airdate)   ? 'far-past' :
           date.isPast(airdate)      ? 'past' :
           date.isRecent(airdate)    ? 'recent' :
           date.isFarFuture(airdate) ? 'far-future' :
           date.isFuture(airdate)    ? 'future' :
                                        'upcoming';
  }.property('episode.airdate')

});
