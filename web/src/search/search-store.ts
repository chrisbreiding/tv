import { action, makeObservable, observable } from 'mobx'

import { searchShows } from '../data/remote'
import type { SearchResultShowProps } from '../lib/types'
import { SearchResultShowModel } from './search-result-show-model'

class SearchStore {
  results: SearchResultShowModel[] = []
  isLoading = false

  constructor () {
    makeObservable(this, {
      results: observable,
      isLoading: observable,

      setResults: action,
      searchShows: action,
    })
  }

  setResults = (results: SearchResultShowProps[]) => {
    this.isLoading = false
    this.results = results.map((sourceShow) => new SearchResultShowModel(sourceShow))
  }

  searchShows = async (query: string) => {
    this.isLoading = true

    const results = await searchShows(query)

    this.setResults(results)
  }
}

export const searchStore = new SearchStore()
