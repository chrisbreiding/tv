import Ember from 'ember';

export default Ember.Component.extend({
  viewLink: function () {
    let viewLink = this.get('settings.viewLink');
    if (!viewLink) {
      return '';
    }

    return viewLink.replace('%s', this.get('show.searchName'));
  }.property('settings.viewLink')
});
