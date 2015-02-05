import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.find('show', params.id);
  },

  actions: {
    close () {
      this.transitionTo('shows');
    }
  }
});
