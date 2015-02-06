import Ember from 'ember';

export default Ember.TextField.extend({
  focus: function () {
    this.$().focus();
  }.on('didInsertElement')
});
