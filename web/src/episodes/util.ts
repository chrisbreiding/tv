import type { EpisodeModel } from '../episodes/episode-model'

interface SeasonAndEpisodes {
  season: number
  episodes: EpisodeModel[]
}

export function inSeasons (episodes: EpisodeModel[]) {
  return episodes.reduce((coll, episode) => {
    const seasonNumber = episode.season || 999 // put season 0 last
    const index = coll.findIndex(({ season }) => season === seasonNumber)

    if (index > -1) {
      coll[index].episodes.push(episode)
    } else {
      coll.push({
        season: seasonNumber,
        episodes: [episode],
      })
    }

    return coll
  }, [] as SeasonAndEpisodes[])
  .sort((a: SeasonAndEpisodes, b: SeasonAndEpisodes) => {
    return a.season - b.season
  })
}

export function sortAscending (a: EpisodeModel, b: EpisodeModel) {
  const dateComparison = a.airdate.valueOf() - b.airdate.valueOf()

  if (!dateComparison) {
    const seasonComparison = a.season - b.season

    if (!seasonComparison) {
      return a.number - b.number
    }
  }

  return dateComparison
}
