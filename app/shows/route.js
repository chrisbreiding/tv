import Ember from 'ember';

export default Ember.Route.extend({
  model () {
    return this.store.find('show');
  },

  setupController (controller, model) {
    this._super(controller, model);
    controller.set('settings', this.store.find('settings', 1));
  }
});
