import Ember from 'ember';

export default Ember.Component.extend({
  seasons: function () {
    return this.get('episodes').reduce(function (coll, episode) {
      var seasonNumber = episode.get('season');
      var season = coll.findBy('season', seasonNumber);
      if (season) {
        season.get('episodes').pushObject(episode);
      } else {
        coll.pushObject(Ember.Object.create({
          season: seasonNumber,
          episodes: Ember.A([episode])
        }));
      }
      return coll;
    }, Ember.A());
  }.property('episodes')
});
