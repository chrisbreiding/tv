import { extendObservable } from 'mobx'
import dayjs from 'dayjs'

import { posterUrl } from '../data/api'

export default class SourceShowModel {
  constructor (sourceShow) {
    extendObservable(this, {
      description: sourceShow.description,
      firstAired: dayjs(sourceShow.first_aired),
      id: sourceShow.id,
      name: sourceShow.name,
      network: sourceShow.network,
      poster: posterUrl(sourceShow.poster),
      status: sourceShow.status,
    })
  }
}
