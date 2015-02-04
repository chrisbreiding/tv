import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    search () {
      this.transitionToRoute('source_shows.search', this.get('query'));
    }
  }
});
