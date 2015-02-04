import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    ok () {
      this.sendAction('ok');
    },

    cancel () {
      this.sendAction('cancel');
    }
  }
});
