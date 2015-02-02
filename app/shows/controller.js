import Ember from 'ember';

export default Ember.ArrayController.extend({

  recent: Ember.computed.filter('model', function (show) {
    return show.get('episodes').isAny('isRecent');
  }),

  upcoming: Ember.computed.filter('model', function (show) {
    return show.get('episodes').isAny('isUpcoming');
  }),

  offair: Ember.computed.setDiff('model', 'upcoming')

});
