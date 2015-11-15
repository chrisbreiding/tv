import Ember from 'ember';

export default Ember.ObjectController.extend({

  actions: {
    destroy () {
      this.send('openModal', 'destroy-show-modal', this.get('model'));
    },

    close () {
      this.transitionToRoute('shows');
    }
  }

});
