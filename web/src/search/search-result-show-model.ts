import { makeObservable, observable } from 'mobx'
import dayjs from 'dayjs'

import { posterUrl } from '../data/remote'
import type { SearchResultShowProps } from '../lib/types'

export class SearchResultShowModel {
  description: string
  firstAired?: dayjs.Dayjs
  id: string
  name: string
  network: string
  poster?: string
  status: string

  constructor (searchResultShow: SearchResultShowProps) {
    makeObservable(this, {
      description: observable,
      firstAired: observable.ref,
      id: observable,
      name: observable,
      network: observable,
      poster: observable,
      status: observable,
    })

    this.description = searchResultShow.description
    this.firstAired = searchResultShow.firstAired ? dayjs(searchResultShow.firstAired) : undefined
    this.id = searchResultShow.id
    this.name = searchResultShow.name
    this.network = searchResultShow.network
    this.poster = searchResultShow.poster ? posterUrl(searchResultShow.poster) : undefined
    this.status = searchResultShow.status
  }
}
