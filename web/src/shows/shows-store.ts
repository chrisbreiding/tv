import orderBy from 'lodash/orderBy'
import { action, computed, makeObservable, observable } from 'mobx'

import type { ShowProps, UpdateShowProps } from '../lib/types'
import type { SearchResultShowModel } from '../search/search-result-show-model'
import { ShowModel } from './show-model'

class ShowsStore {
  isLoadingFromRemote = true
  isLoadingFromCache = true
  shows: ShowModel[] = []

  constructor () {
    makeObservable(this, {
      isLoadingFromRemote: observable,
      isLoadingFromCache: observable,
      shows: observable,

      recent: computed,
      upcoming: computed,
      offAir: computed,

      setIsLoadingFromRemote: action,
      setIsLoadingFromCache: action,
      setShows: action,
      addShow: action,
      updateShow: action,
      deleteShow: action,
    })
  }

  get recent () {
    const filteredShows = this.shows.filter(({ hasRecent }) => hasRecent)

    return orderBy(filteredShows, ['lastEpisode.airdate', 'displayName'], ['desc', 'asc'])
  }

  get upcoming () {
    const filteredShows = this.shows.filter(({ hasUpcoming }) => hasUpcoming)

    return orderBy(filteredShows, ['nextEpisode.airdate', 'displayName'], ['asc', 'asc'])
  }

  get offAir () {
    const filteredShows = this.shows.filter(({ isOffAir }) => isOffAir)

    return orderBy(filteredShows, ['displayName'], ['asc'])
  }

  setIsLoadingFromRemote (isLoading: boolean) {
    this.isLoadingFromRemote = isLoading
  }

  setIsLoadingFromCache (isLoading: boolean) {
    this.isLoadingFromCache = isLoading
  }

  getShowById (id: string) {
    return this.shows.find((show) => show.id === id)
  }

  hasShow (searchResultShow: SearchResultShowModel) {
    return !!this.getShowById(searchResultShow.id)
  }

  setShows (shows: ShowProps[]) {
    this.shows = shows.map((show) => new ShowModel(show))
  }

  addShow (show: ShowProps) {
    this.shows.push(new ShowModel(show))
  }

  updateShow (showProps: UpdateShowProps) {
    const show = this.getShowById(showProps.id)

    if (show) {
      Object.assign(show, showProps)
    }
  }

  deleteShow ({ id }: { id: string }) {
    this.shows = this.shows.filter((show) => show.id !== id)
  }

  serialize () {
    return this.shows.map((show) => show.serialize())
  }

  deserialize (shows: ShowProps[]) {
    return shows.map((show) => new ShowModel(show))
  }
}

export const showsStore = new ShowsStore()
