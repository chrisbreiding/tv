import Ember from 'ember';

export default Ember.Route.extend({
  model () {
    return this.store.find('setting', 1);
  },

  actions: {
    close () {
      this.transitionTo('shows');
    }
  }
});