import _ from 'lodash'
import { computed, observable } from 'mobx'

import EpisodeModel from '../episodes/episode-model'
import { sortAscending } from '../episodes/util'

export default class ShowModel {
  @observable id
  @observable displayName
  @observable searchName
  @observable fileName
  @observable sourceId
  @observable episodeIds

  constructor (show) {
    this.id = show.id
    this.displayName = show.display_name
    this.searchName = show.search_name
    this.fileName = show.file_name
    this.sourceId = show.source_id
    this.episodes = _.map(show.episodes, (episode) => new EpisodeModel(episode))
  }

  @computed get hasRecent () {
    return this.recentEpisodes.length > 0
  }

  @computed get recentEpisodes () {
    return _(this.episodes)
      .filter({ isRecent: true })
      .sort(sortAscending)
      .value()
  }

  @computed get hasUpcoming () {
    return this.upcomingEpisodes.length > 0
  }

  @computed get upcomingEpisodes () {
    return _(this.episodes)
      .filter({ isUpcoming: true })
      .sort(sortAscending)
      .value()
  }

  @computed get isOffAir () {
    return !this.recentEpisodes.length && !this.upcomingEpisodes.length
  }

  @computed get offAirEpisodes () {
    return []
  }

  @computed get nextEpisode () {
    return this.upcomingEpisodes[0]
  }

  @computed get lastEpisode () {
    return this.recentEpisodes[0]
  }

  serialize () {
    const episodes = _(this.episodes)
      .filter((episode) => {
        return episode.isRecent || episode.isUpcoming
      })
      .map((episode) => episode.serialize())
      .value()

    return {
      id: this.id,
      display_name: this.displayName,
      search_name: this.searchName,
      file_name: this.fileName,
      source_id: this.sourceId,
      episodes,
    }
  }
}
