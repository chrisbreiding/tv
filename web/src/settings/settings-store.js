import { action, computed, makeObservable, observable } from 'mobx'
import dayjs from 'dayjs'

class SettingsStore {
  hideSpecialEpisodes = false
  hideTBAEpisodes = 'NONE'
  isLoading = false
  lastUpdated = null
  searchLinks = []
  username = null

  constructor () {
    makeObservable(this, {
      hideSpecialEpisodes: observable,
      hideTBAEpisodes: observable,
      isLoading: observable,
      lastUpdated: observable.ref,
      searchLinks: observable,
      username: observable,

      hideAllTBAEPisodes: computed,
      showOutdatedWarning: computed,

      setIsLoading: action,
      setSettings: action,
    })
  }

  get hideAllTBAEPisodes () {
    return this.hideTBAEpisodes === 'ALL'
  }

  get showOutdatedWarning () {
    const oneDayAgo = dayjs().subtract(1, 'day')

    return this.username === 'chris' && this.lastUpdated?.isBefore(oneDayAgo)
  }

  setIsLoading = (isLoading) => {
    this.isLoading = isLoading
  }

  setSettings = (settings) => {
    if (settings.hideSpecialEpisodes != null) this.hideSpecialEpisodes = settings.hideSpecialEpisodes
    if (settings.hideTBAEpisodes) this.hideTBAEpisodes = settings.hideTBAEpisodes
    if (settings.lastUpdated) this.lastUpdated = dayjs(settings.lastUpdated)
    if (settings.searchLinks) this.searchLinks = settings.searchLinks
    if (settings.username) this.username = settings.username
  }

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
