import _ from 'lodash'
import { action, extendObservable } from 'mobx'

import api from '../data/api'
import SourceShowModel from './source-show-model'

class SearchStore {
  constructor () {
    extendObservable(this, {
      results: [],
      isLoading: false,

      setResults: action(this.setResults),
      searchShows: action(this.searchShows),
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
