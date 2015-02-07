import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel: function () {
    this.authService.onDeAuth(() => {
      this.transitionTo('auth');
    });
  },

  actions: {
    openModal (name, model) {
      return this.render(name, {
        into: 'application',
        outlet: 'modal',
        model: model
      });
    },

    closeModal () {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
});
