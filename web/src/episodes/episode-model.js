import _ from 'lodash'
import { asReference, computed, observable } from 'mobx'
import moment from 'moment'
import util from '../lib/util'

const recentDaysCutoff = localStorage.recentDaysCutoff || 5

const epochISOString = moment.utc([1970, 0, 1]).toISOString()
const farFarFutureMs = moment([2077, 11, 31]).valueOf()

const nullDate = {
  isSame () { return false },
  isBefore () { return false },
  isBetween () { return false },
  isAfter () { return true },
  toISOString () { return epochISOString },
  format () { return 'TBA' },
  // so comparisons put it ahead of anything else
  valueOf () { return farFarFutureMs },
}

export default class EpisodeModel {
  @observable id
  @observable season
  @observable number
  @observable title
  @observable airdate = asReference(null)

  constructor (episode) {
    this.id = episode.id
    this.season = episode.season
    this.number = episode.episode_number
    this.title = _.trim(episode.title)

    const airdate = moment(episode.airdate)
    // if year is before 1975, it's a null date set to unix epoch
    this.airdate = airdate.year() < 1975 ? nullDate : airdate
  }

  @computed get isRecent () {
    let startOfiveDaysAgo = moment().subtract(recentDaysCutoff, 'days').startOf('day')
    let startOfToday = moment().startOf('day')
    return this.airdate.isBetween(startOfiveDaysAgo.subtract(1, 'second'), startOfToday)
  }

  @computed get isUpcoming () {
    let startOfToday = moment().startOf('day')
    return this.airdate.isAfter(startOfToday.subtract(1, 'second'))
  }

  @computed get longEpisodeNumber () {
    return `s${util.pad(this.season)}e${util.pad(this.number)}`
  }

  @computed get shortEpisodeNumber () {
    return `${this.season}${util.pad(this.number)}`
  }

  @computed get fileSafeTitle () {
    if (this.title == null) {
      return ''
    }

    return this.title
      .replace(/[\/\\]/g, '-')
      .replace(/\:\s+/g, ' - ')
      .replace(/\&/g, 'and')
      .replace(/[\.\!\?\@\#\$\%\^\*\:]/g, '')
  }

  serialize () {
    return {
      id: this.id,
      season: this.season,
      episode_number: this.number,
      title: this.title,
      airdate: this.airdate.toISOString(),
    }
  }
}
