import Ember from 'ember';
import $ from 'jquery';

export default Ember.Component.extend({

  setup: function () {
    $(document.body).addClass('modal-dialog-present');
  }.on('didInsertElement'),

  willDestroy: function () {
    $(document.body).removeClass('modal-dialog-present');
  },

  actions: {
    ok () {
      this.sendAction('ok');
    },

    cancel () {
      this.sendAction('cancel');
    },

    close () {
      this.sendAction('close');
    }
  }
});
