import DS from 'ember-data';
import Ember from 'ember';
import date from '../utils/date';

let attr = DS.attr;

export default DS.Model.extend({
  displayName: attr('string'),
  searchName: attr('string'),
  fileName: attr('string'),
  sourceId: attr('string'),

  episodes: DS.hasMany('episode'),

  sortedEpisodes: Ember.computed.sort('episodes.@each.airdate', function (a, b) {
    return date.compare(a.get('airdate'), b.get('airdate'));
  }),

  recentEpisodes: Ember.computed.filterBy('sortedEpisodes', 'isRecent'),
  hasRecent: Ember.computed.notEmpty('recentEpisodes'),

  upcomingEpisodes: Ember.computed.filterBy('sortedEpisodes', 'isUpcoming'),
  hasUpcoming: Ember.computed.notEmpty('upcomingEpisodes'),

  isOffAir: Ember.computed.empty('upcomingEpisodes'),

  nextEpisode: function () {
    return this.get('upcomingEpisodes.firstObject');
  }.property('upcomingEpisodes.firstObject'),

  lastEpisode: function () {
    return this.get('recentEpisodes.firstObject');
  }.property('recentEpisodes.firstObject'),
});
