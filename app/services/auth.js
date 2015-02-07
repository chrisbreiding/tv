import Ember from 'ember';

export default Ember.Object.extend({
  onDeAuth (callback) {
    this.set('deAuthCallback', callback);
  },

  didDeAuth () {
    this.get('deAuthCallback')();
  }
});
