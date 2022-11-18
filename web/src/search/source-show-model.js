import { extendObservable } from 'mobx'
import moment from 'moment'

import { posterUrl } from '../data/api'

export default class SourceShowModel {
  constructor (sourceShow) {
    extendObservable(this, {
      description: sourceShow.description,
      firstAired: moment(sourceShow.first_aired),
      id: sourceShow.id,
      name: sourceShow.name,
      network: sourceShow.network,
      poster: posterUrl(sourceShow.poster),
      status: sourceShow.status,
    })
  }
}
