import { makeObservable, observable } from 'mobx'
import dayjs from 'dayjs'

import { posterUrl } from '../data/api'

export default class SourceShowModel {
  description
  firstAired
  id
  name
  network
  poster
  status

  constructor (sourceShow) {
    makeObservable(this, {
      description: observable,
      firstAired: observable.ref,
      id: observable,
      name: observable,
      network: observable,
      poster: observable,
      status: observable,
    })

    Object.assign(this, {
      description: sourceShow.description,
      firstAired: dayjs(sourceShow.firstAired),
      id: sourceShow.id,
      name: sourceShow.name,
      network: sourceShow.network,
      poster: posterUrl(sourceShow.poster),
      status: sourceShow.status,
    })
  }
}
