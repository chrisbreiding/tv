import { action, computed, makeObservable, observable, toJS } from 'mobx'
import dayjs from 'dayjs'
import type { SettingsProps } from '../lib/types'

interface SearchLink {
  name: string
  showLink: string
  episodeLink: string
}

class SettingsStore {
  hideSpecialEpisodes = false
  hideTBAEpisodes: SettingsProps['hideTBAEpisodes'] = 'NONE'
  isLoading = true
  lastUpdated?: dayjs.Dayjs
  searchLinks: SearchLink[] = []
  username?: string

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

  setIsLoading = (isLoading: boolean) => {
    this.isLoading = isLoading
  }

  setSettings = (settings: Partial<SettingsProps>) => {
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
      lastUpdated: this.lastUpdated?.toISOString(),
      searchLinks: toJS(this.searchLinks),
      username: this.username,
    } as SettingsProps
  }
}

export const settingsStore = new SettingsStore()
