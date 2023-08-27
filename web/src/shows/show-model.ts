import { computed, makeObservable, observable } from 'mobx'

import { posterUrl } from '../data/remote'
import { EpisodeModel } from '../episodes/episode-model'
import { sortAscending } from '../episodes/util'
import type { ShowProps, Status } from '../lib/types'
import { settingsStore } from '../settings/settings-store'

export class ShowModel {
  displayName: string
  episodes: EpisodeModel[]
  fileName: string
  id: string
  network: string
  poster: string
  searchName: string
  status: Status

  constructor (show: ShowProps) {
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

    this.displayName = show.displayName
    this.episodes = show.episodes.map((episode) => {
      return episode instanceof EpisodeModel ? episode : new EpisodeModel(episode)
    })
    this.fileName = show.fileName
    this.id = show.id
    this.network = show.network
    this.poster = posterUrl(show.poster)
    this.searchName = show.searchName
    this.status = show.status
  }

  get hasRecent () {
    return this.recentEpisodes.length > 0
  }

  get recentEpisodes () {
    return this.episodes
    .filter((episode) => {
      const specialFilter = settingsStore.hideSpecialEpisodes ? !episode.isSpecial : true
      const tbaFilter = settingsStore.hideAllTBAEPisodes ? !episode.isTBA : true

      return episode.isRecent && specialFilter && tbaFilter
    })
    .sort(sortAscending)
  }

  get hasUpcoming () {
    return this.upcomingEpisodes.length > 0
  }

  get upcomingEpisodes () {
    return this.episodes
    .filter((episode) => {
      const specialFilter = settingsStore.hideSpecialEpisodes ? !episode.isSpecial : true
      const tbaFilter = settingsStore.hideAllTBAEPisodes ? !episode.isTBA : true

      return episode.isUpcoming && specialFilter && tbaFilter
    })
    .sort(sortAscending)
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

  getEpisodesForDate (date: dayjs.Dayjs) {
    return this.episodes.filter((episode) => {
      return episode.airdate.isSame(date, 'date')
    })
  }

  serialize () {
    return {
      displayName: this.displayName,
      episodes: this.episodes.map((episode) => episode.serialize()),
      fileName: this.fileName,
      id: this.id,
      network: this.network,
      poster: this.poster,
      searchName: this.searchName,
      status: this.status,
    }
  }

  serializeWithoutEpisodes () {
    return {
      displayName: this.displayName,
      fileName: this.fileName,
      id: this.id,
      network: this.network,
      poster: this.poster,
      searchName: this.searchName,
      status: this.status,
    }
  }
}
