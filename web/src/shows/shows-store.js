import _ from 'lodash'
import { computed, makeObservable, observable } from 'mobx'

import ShowModel from './show-model'

class ShowsStore {
  isLoadingFromApi = false
  isLoadingFromCache = false
  shows = []

  constructor () {
    makeObservable(this, {
      isLoadingFromApi: observable,
      isLoadingFromCache: observable,
      shows: observable,

      recent: computed,
      upcoming: computed,
      offAir: computed,
    })
  }

  get recent () {
    return _(this.shows)
    .filter({ hasRecent: true })
    .orderBy(['lastEpisode.airdate', 'displayName'], ['desc', 'asc'])
    .value()
  }

  get upcoming () {
    return _(this.shows)
    .filter({ hasUpcoming: true })
    .orderBy(['nextEpisode.airdate', 'displayName'], ['asc', 'asc'])
    .value()
  }

  get offAir () {
    return _(this.shows)
    .filter({ isOffAir: true })
    .orderBy(['displayName'], ['asc'])
    .value()
  }

  getShowById (id) {
    return this.shows.find((show) => show.id === id)
  }

  hasSourceShow (sourceShow) {
    return !!this.getShowById(sourceShow.id)
  }

  _sortAlphabetically (a, b) {
    const aName = a.displayName.toLowerCase()
    const bName = b.displayName.toLowerCase()
    if (aName < bName) return -1
    if (aName > bName) return 1
    return 0
  }

  setShows (shows) {
    this.shows = _.map(shows, (show) => new ShowModel(show))
  }

  addShow (show) {
    this.shows.push(new ShowModel(show))
  }

  updateShow (showProps) {
    const show = this.getShowById(showProps.id)
    _.extend(show, showProps)
  }

  deleteShow ({ id }) {
    _.remove(this.shows, (show) => show.id === id)
  }

  serialize () {
    return _([
      this.recent.slice(),
      this.upcoming.slice(),
      this.offAir.slice(),
    ])
    .flatten()
    .uniqBy('id')
    .map((show) => show.serialize())
    .value()
  }

  deserialize (shows) {
    return _.map(shows, (show) => new ShowModel(show))
  }
}

export default new ShowsStore()
