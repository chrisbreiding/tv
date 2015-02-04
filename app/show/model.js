import DS from 'ember-data';
import Ember from 'ember';

let attr = DS.attr;

export default DS.Model.extend({
  displayName: attr('string'),
  searchName: attr('string'),
  fileName: attr('string'),
  sourceId: attr('string'),

  episodes: DS.hasMany('episode'),

  recentEpisodes: Ember.computed.filterBy('episodes', 'isRecent'),
  hasRecent: Ember.computed.notEmpty('recentEpisodes'),

  upcomingEpisodes: Ember.computed.filterBy('episodes', 'isUpcoming'),
  hasUpcoming: Ember.computed.notEmpty('upcomingEpisodes'),

  isOffAir: Ember.computed.empty('upcomingEpisodes')
});
