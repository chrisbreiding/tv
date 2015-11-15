import Ember from 'ember';

export default Ember.Route.extend({
  model (params) {
    return this.store.find('source-show', { query: params.query });
  },

  actions: {
    add (show) {
      this.store.filter('show', (aShow) => {
        return aShow.get('sourceId') === show.get('id');
      }).then((shows) => {
        const name = show.get('name');

        if (shows.get('length')) {
          return shows;
        } else {
          return this.store.createRecord('show', {
            displayName: name,
            searchName: name,
            fileName: name,
            sourceId: show.get('id')
          }).save();
        }
      }).then(() => {
        this.transitionTo('shows');
      });
    }
  }
});
