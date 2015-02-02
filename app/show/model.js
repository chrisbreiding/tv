import DS from 'ember-data';

let attr = DS.attr;

export default DS.Model.extend({
  displayName: attr('string'),
  searchName: attr('string'),
  fileName: attr('string'),
  tvsourceId: attr('string'),

  episodes: DS.hasMany('episode')
});
