import Ember from 'ember';

export default Ember.Route.extend({
  model () {
    return {
      apiKey: localStorage.apiKey
    };
  },

  actions: {
    authenticate (apiKey) {
      localStorage.apiKey = apiKey;
      this.transitionTo('shows');
    }
  }
});
