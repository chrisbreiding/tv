import Ember from 'ember';

export default Ember.ObjectController.extend({

  actions: {
    save () {
      this.get('model').save().then(() => {
        this.transitionToRoute('shows');
      });
    },

    destroy () {
      this.send('openModal', 'destroy-show-modal', this.get('model'));
    }
  }

});
