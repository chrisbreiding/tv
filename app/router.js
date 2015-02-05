import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('shows', { path: '/' }, function () {
    this.resource('show', { path: ':id' });
    this.route('edit', { path: ':id/edit' });
    this.resource('source-shows', { path: 'search'}, function () {
      this.route('search', { path: ':query' });
    });
  });
});

export default Router;
