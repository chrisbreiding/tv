import _ from 'lodash'
import { computed, observable } from 'mobx'

import ShowModel from './show-model'
import { indexed } from '../episodes/util'

class ShowsStore {
  @observable shows = []
  @observable isLoading = false

  getShowById (id) {
    return this.shows.find((show) => show.id === id)
  }

  hasSourceShow (sourceShow) {
    return !!this.shows.find((show) => show.sourceId === sourceShow.id)
  }

  @computed get recent () {
    return _(this.shows)
      .filter({ hasRecent: true })
      .sort(this._sortByAirdateDescending)
      .value()
  }

  _sortByAirdateDescending (a, b) {
    return b.lastEpisode.airdate - a.lastEpisode.airdate
  }

  @computed get upcoming () {
    return _(this.shows)
      .filter({ hasUpcoming: true })
      .sort(this._sortByAirdateAscending)
      .value()
  }

  _sortByAirdateAscending (a, b) {
    return a.nextEpisode.airdate - b.nextEpisode.airdate
  }

  @computed get offAir () {
    return _(this.shows)
      .filter({ isOffAir: true })
      .sort(this._sortAlphabetically)
      .value()
  }

  _sortAlphabetically (a, b) {
    const aName = a.displayName.toLowerCase()
    const bName = b.displayName.toLowerCase()
    if (aName < bName) return -1
    if (aName > bName) return 1
    return 0
  }

  showsWithEpisodes (shows, episodes) {
    const episodesIndex = indexed(episodes)
    return _.map(shows, (show) => {
      return _(show)
        .extend({
          episodes: _.map(show.episode_ids, (episodeId) => episodesIndex[episodeId]),
        })
        .omit('episode_ids')
        .value()
    })
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
