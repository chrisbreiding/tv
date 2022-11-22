import { action, asReference, extendObservable } from 'mobx'
import dayjs from 'dayjs'

class SettingsStore {
  constructor () {
    extendObservable(this, {
      hideSpecialEpisodes: false,
      hideTBAEpisodes: 'NONE', // 'NONE' | 'ALL'
      isLoading: false,
      searchLinks: [],
      lastUpdated: asReference(null),
      username: null,

      get hideAllTBAEPisodes () {
        return this.hideTBAEpisodes === 'ALL'
      },

      get showOutdatedWarning () {
        const oneDayAgo = dayjs().subtract(1, 'day')

        return this.username === 'chris' && this.lastUpdated?.isBefore(oneDayAgo)
      },
    })
  }

  setIsLoading = action((isLoading) => {
    this.isLoading = isLoading
  })

  setSettings = action((settings) => {
    if (settings.hideSpecialEpisodes != null) this.hideSpecialEpisodes = settings.hideSpecialEpisodes
    if (settings.hideTBAEpisodes) this.hideTBAEpisodes = settings.hideTBAEpisodes
    if (settings.lastUpdated) this.lastUpdated = dayjs(settings.lastUpdated)
    if (settings.searchLinks) this.searchLinks = settings.searchLinks
    if (settings.username) this.username = settings.username
  })

  serialize () {
    return {
      hideSpecialEpisodes: this.hideSpecialEpisodes,
      hideTBAEpisodes: this.hideTBAEpisodes,
      lastUpdated: this.lastUpdated.toISOString(),
      searchLinks: this.searchLinks,
      username: this.username,
    }
  }
}

export default new SettingsStore()
