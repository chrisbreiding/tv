import { action, extendObservable } from 'mobx'
import moment from 'moment'

class SettingsStore {
  constructor () {
    extendObservable(this, {
      isLoading: false,
      lastUpdated: null,
      searchLinks: [],
      hideSpecialEpisodes: false,
      hideTBAEpisodes: 'NONE', // 'NONE' | 'ALL'

      get hideAllTBAEPisodes () {
        return this.hideTBAEpisodes === 'ALL'
      },
    })
  }

  setIsLoading = action((isLoading) => {
    this.isLoading = isLoading
  })

  setSettings = action((settings) => {
    if (settings.lastUpdated) this.lastUpdated = moment(settings.lastUpdated)
    if (settings.hideSpecialEpisodes != null) this.hideSpecialEpisodes = settings.hideSpecialEpisodes
    if (settings.hideTBAEpisodes) this.hideTBAEpisodes = settings.hideTBAEpisodes
    if (settings.searchLinks) this.searchLinks = settings.searchLinks
  })

  serialize () {
    return {
      hideSpecialEpisodes: this.hideSpecialEpisodes,
      hideTBAEpisodes: this.hideTBAEpisodes,
      lastUpdated: this.lastUpdated.toISOString(),
      searchLinks: this.searchLinks,
    }
  }
}

export default new SettingsStore()
