import _ from 'lodash'

function indexed (episodes) {
  return _.reduce(episodes, (coll, episode) => {
    coll[episode.id] = episode
    return coll
  }, {})
}

function inSeasons (episodes) {
  const seasons = _.reduce(episodes, (coll, episode) => {
    const seasonNumber = episode.season || 999 // put sesaon 0 last
    const index = _.findIndex(coll, { season: seasonNumber })
    if (index > -1) {
      coll[index].episodes.push(episode)
    } else {
      coll.push({
        season: seasonNumber,
        episodes: [episode],
      })
    }
    return coll
  }, [])

  return _.sortBy(seasons, 'season')
}

function sortAscending (a, b) {
  const dateComparison = a.airdate - b.airdate
  if (!dateComparison) {
    const seasonComparison = a.season - b.season
    if (!seasonComparison) {
      return a.number - b.number
    }
  }
  return dateComparison
}

export {
  indexed,
  inSeasons,
  sortAscending,
}
