import _ from 'lodash'
import { computed, makeObservable, observable } from 'mobx'

import { posterUrl } from '../data/api'
import EpisodeModel from '../episodes/episode-model'
import { sortAscending } from '../episodes/util'
import settingsStore from '../settings/settings-store'

export default class ShowModel {
  displayName
  episodes
  fileName
  id
  network
  poster
  searchName
  status

  constructor (show) {
    makeObservable(this, {
      displayName: observable,
      episodes: observable,
      fileName: observable,
      id: observable,
      network: observable,
      poster: observable,
      searchName: observable,
      status: observable,

      hasRecent: computed,
      recentEpisodes: computed,
      hasUpcoming: computed,
      upcomingEpisodes: computed,
      isOffAir: computed,
      offAirEpisodes: computed,
      nextEpisode: computed,
      lastEpisode: computed,
    })

    Object.assign(this, {
      displayName: show.displayName,
      episodes: _.map(show.episodes, (episode) => new EpisodeModel(episode)),
      fileName: show.fileName,
      id: show.id,
      network: show.network,
      poster: posterUrl(show.poster),
      searchName: show.searchName,
      status: show.status,
    })
  }

  get hasRecent () {
    return this.recentEpisodes.length > 0
  }

  get recentEpisodes () {
    return _(this.episodes)
    .filter((episode) => {
      const specialFilter = settingsStore.hideSpecialEpisodes ? !episode.isSpecial : true
      const tbaFilter = settingsStore.hideAllTBAEPisodes ? !episode.isTBA : true

      return episode.isRecent && specialFilter && tbaFilter
    })
    .sort(sortAscending)
    .value()
  }

  get hasUpcoming () {
    return this.upcomingEpisodes.length > 0
  }

  get upcomingEpisodes () {
    return _(this.episodes)
    .filter((episode) => {
      const specialFilter = settingsStore.hideSpecialEpisodes ? !episode.isSpecial : true
      const tbaFilter = settingsStore.hideAllTBAEPisodes ? !episode.isTBA : true

      return episode.isUpcoming && specialFilter && tbaFilter
    })
    .sort(sortAscending)
    .value()
  }

  get isOffAir () {
    return !this.recentEpisodes.length && !this.upcomingEpisodes.length
  }

  get offAirEpisodes () {
    return []
  }

  get nextEpisode () {
    return this.upcomingEpisodes[0]
  }

  get lastEpisode () {
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
      displayName: this.displayName,
      episodes,
      fileName: this.fileName,
      id: this.id,
      network: this.network,
      poster: this.poster,
      searchName: this.searchName,
      status: this.status,
    }
  }
}
