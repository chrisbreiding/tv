import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    ok () {
      this.get('model').destroyRecord().then(() => {
        this.send('closeModal');
        this.transitionToRoute('shows');
      });
    }
  }
});
