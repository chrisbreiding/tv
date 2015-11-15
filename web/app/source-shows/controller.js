import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    search () {
      this.transitionToRoute('source-shows.search', this.get('query'));
    },

    close () {
      this.transitionToRoute('shows');
    }
  }
});
