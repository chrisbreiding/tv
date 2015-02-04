import Ember from 'ember';

export default Ember.Route.extend({
  model (params) {
    return this.store.find('source-show', { query: params.query });
  },

  actions: {
    add (show) {
      let name = show.get('name');

      this.store.createRecord('show', {
        displayName: name,
        searchName: name,
        fileName: name,
        sourceId: show.get('id')
      }).save().then(() => {
        this.transitionTo('shows');
      });
    }
  }
});
