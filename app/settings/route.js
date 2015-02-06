import Ember from 'ember';

export default Ember.Route.extend({
  model () {
    return this.store.find('settings');
  },

  actions: {
    close () {
      this.transitionTo('shows');
    }
  }
});
