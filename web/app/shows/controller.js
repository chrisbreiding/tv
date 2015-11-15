import Ember from 'ember';
import date from '../utils/date';

export default Ember.ArrayController.extend({

  unsortedRecent: Ember.computed.filterBy('model', 'hasRecent'),
  recent: Ember.computed.sort('unsortedRecent', function (a, b) {
    return date.compare(b.get('lastEpisode.airdate'),
                        a.get('lastEpisode.airdate'));
  }),

  unsortedUpcoming: Ember.computed.filterBy('model', 'hasUpcoming'),
  upcoming: Ember.computed.sort('unsortedUpcoming', function(a, b) {
    return date.compare(a.get('nextEpisode.airdate'),
                        b.get('nextEpisode.airdate'));
  }),

  offAir: Ember.computed.filterBy('model', 'isOffAir')

});
