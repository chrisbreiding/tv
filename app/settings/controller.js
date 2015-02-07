import Ember from 'ember';

export default Ember.ArrayController.extend({
  data: Ember.computed.alias('model.firstObject'),

  actions: {
    save () {
      this.get('data').save().then(() => {
        this.transitionToRoute('shows');
      });
    }
  }
});
