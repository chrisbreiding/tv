import DS from 'ember-data';

let attr = DS.attr;

export default DS.Model.extend({
  name: attr('string'),
  description: attr('string'),
  firstAired: attr('date'),
  network: attr('string')
});