import DS from 'ember-data';
import Ember from 'ember';
import ENV from 'tv/config/environment';

Ember.Inflector.inflector.uncountable('settings');

export default DS.ActiveModelAdapter.extend({
  host: ENV.host,
  namespace: ENV.namespace
});
