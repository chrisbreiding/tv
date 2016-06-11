import _ from 'lodash';

function indexed (episodes) {
  return _.reduce(episodes, (coll, episode) => {
    coll[episode.id] = episode;
    return coll;
  }, {});
}

function get (id) {
  return this.episodes[id];
}

function inSeasons (episodes) {
  const seasons = _.reduce(episodes, (coll, episode) => {
    const seasonNumber = episode.season;
    const index = _.findIndex(coll, { season: seasonNumber });
    if (index > -1) {
      coll[index].episodes.push(episode);
    } else {
      coll.push({
        season: seasonNumber,
        episodes: [episode],
      });
    }
    return coll;
  }, []);

  return _.sortBy(seasons, 'season');
}

function sortAscending (a, b) {
  const dateComparison = a.airdate - b.airdate;
  if (!dateComparison) {
    const seasonComparison = a.season - b.season;
    if (!seasonComparison) {
      return a.episode_number - b.episode_number;
    }
  }
  return dateComparison;
}

export {
  indexed,
  get,
  inSeasons,
  sortAscending,
};
