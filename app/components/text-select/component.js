import Ember from 'ember';

export default Ember.Component.extend({
  click () {
    let text = this.$()[0];
    let selection = window.getSelection();
    let range = document.createRange();

    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
  }
});
