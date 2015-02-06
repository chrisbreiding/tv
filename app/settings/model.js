import DS from 'ember-data';

let attr = DS.attr;

export default DS.Model.extend({
  viewLink: attr('string'),
  lastUpdated: attr('date')
});
