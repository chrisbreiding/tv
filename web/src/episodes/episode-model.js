import { asReference, extendObservable } from 'mobx'
import dayjs from 'dayjs'
import util from '../lib/util'

const recentDaysCutoff = localStorage.recentDaysCutoff || 5

const epochUTC = dayjs('1970-01-01')
const epochISOString = epochUTC.toISOString()
const farPastMs = epochUTC.valueOf()
const farFarFutureMs = dayjs('2077-12-31').valueOf()

// episodes with season 0 may never have airdates, so treat them as far
// past so they don't always show up as upcoming
const nullDate = (isSeasoned) => ({
  isNull: true,
  isSame () { return false },
  isBefore () { return !isSeasoned },
  isBetween () { return false },
  isAfter () { return isSeasoned },
  toISOString () { return epochISOString },
  format () { return isSeasoned ? 'TBA' : '---' },
  // so comparisons put it ahead of anything else
  valueOf () { return isSeasoned ? farFarFutureMs : farPastMs },
})

export default class EpisodeModel {
  constructor (episode) {
    const airdate = episode.airdate ? dayjs(episode.airdate) : undefined

    extendObservable(this, {
      // if year is before 1975, it's a null date set to unix epoch
      airdate: asReference(!airdate || airdate.year() < 1975 ? nullDate(!!episode.season) : airdate),
      id: episode.id,
      number: episode.number,
      season: episode.season,
      title: episode.title,

      get isSpecial () {
        return !this.season
      },

      get isTBA () {
        return (!this.title || this.title === 'TBA') && this.airdate.isNull
      },

      get isRecent () {
        const startOfiveDaysAgo = dayjs().subtract(recentDaysCutoff, 'days').startOf('day')
        const startOfToday = dayjs().startOf('day')

        return this.airdate.isBetween(startOfiveDaysAgo.subtract(1, 'second'), startOfToday)
      },

      get isUpcoming () {
        let startOfToday = dayjs().startOf('day')
        return this.airdate.isAfter(startOfToday.subtract(1, 'second'))
      },

      get longEpisodeNumber () {
        return `s${util.pad(this.season)}e${util.pad(this.number)}`
      },

      get shortEpisodeNumber () {
        return `${this.season}${util.pad(this.number)}`
      },

      get fileSafeTitle () {
        if (this.title == null) {
          return ''
        }

        return this.title
        .replace(/[\/\\]/g, '-')
        .replace(/\:\s+/g, ' - ')
        .replace(/\&/g, 'and')
        .replace(/[\.\!\?\@\#\$\%\^\*\:]/g, '')
      },
    })
  }


  serialize () {
    return {
      id: this.id,
      season: this.season,
      number: this.number,
      title: this.title,
      airdate: this.airdate.toISOString(),
    }
  }
}
