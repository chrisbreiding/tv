import _ from 'lodash'
import { action, makeObservable, observable } from 'mobx'

import api from '../data/api'
import SourceShowModel from './source-show-model'

class SearchStore {
  results = []
  isLoading = false

  constructor () {
    makeObservable(this, {
      results: observable,
      isLoading: observable,

      setResults: action,
      searchShows: action,
    })
  }

  setResults = (results) => {
    this.isLoading = false
    this.results = _.map(results, (sourceShow) => new SourceShowModel(sourceShow))
  }

  searchShows = (query) => {
    this.isLoading = true
    api.searchShows(query).then((results) => {
      this.setResults(results)
    })
  }
}

export default new SearchStore()
