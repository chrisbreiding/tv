import DS from 'ember-data';

let attr = DS.attr;

export default DS.Model.extend({
  display_name: attr('string'),
  search_name: attr('string'),
  file_name: attr('string'),
  tvsource_id: attr('string'),

  episodes: DS.hasMany('episode')
});
