import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'ul',

  collapsed: true,

  beyondThreshold: function () {
    if (!this.get('threshold')) {
      return false;
    }
    return this.get('items.length') > this.get('threshold');
  }.property('items.length', 'threshold'),

  curatedItems: function () {
    if (!this.get('threshold') || !this.get('collapsed')) {
      return this.get('items');
    }
    return this.get('items').slice(0, this.get('threshold'));
  }.property('items', 'threshold', 'collapsed'),

  actionText: function () {
    return this.get('collapsed') ? 'more' : 'less';
  }.property('collapsed'),

  actions: {
    update () {
      this.toggleProperty('collapsed');
    }
  }
});
