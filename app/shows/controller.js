import Ember from 'ember';

export default Ember.ArrayController.extend({

  recent: Ember.computed.filterBy('model', 'hasRecent'),
  upcoming: Ember.computed.filterBy('model', 'hasUpcoming'),
  offAir: Ember.computed.filterBy('model', 'isOffAir')

});
