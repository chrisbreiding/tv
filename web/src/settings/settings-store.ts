import { action, computed, makeObservable, observable, toJS } from 'mobx'
import dayjs from 'dayjs'
import type { SettingsProps } from '../lib/types'
import { now } from '../lib/date'

interface SearchLink {
  name: string
  showLink: string
  episodeLink: string
}

class SettingsStore {
  hideSpecialEpisodes = false
  hideTBAEpisodes: SettingsProps['hideTBAEpisodes'] = 'NONE'
  isAdmin = false
  isLoadingFromRemote = true
  isLoadingFromCache = true
  lastUpdated?: dayjs.Dayjs
  searchLinks: SearchLink[] = []
  username?: string

  constructor () {
    makeObservable(this, {
      hideSpecialEpisodes: observable,
      hideTBAEpisodes: observable,
      isAdmin: observable,
      isLoadingFromRemote: observable,
      isLoadingFromCache: observable,
      lastUpdated: observable.ref,
      searchLinks: observable,
      username: observable,

      hideAllTBAEPisodes: computed,
      showOutdatedWarning: computed,

      setIsLoadingFromRemote: action,
      setIsLoadingFromCache: action,
      setSettings: action,
    })
  }

  get hideAllTBAEPisodes () {
    return this.hideTBAEpisodes === 'ALL'
  }

  get showOutdatedWarning () {
    // if (this.isLoadingFromRemote) return false

    const oneDayAgo = now().subtract(1, 'day')

    return this.isAdmin && this.lastUpdated?.isBefore(oneDayAgo)
  }

  setIsLoadingFromRemote (isLoading: boolean) {
    this.isLoadingFromRemote = isLoading
  }

  setIsLoadingFromCache = (isLoading: boolean) => {
    this.isLoadingFromCache = isLoading
  }

  setSettings = (settings: Partial<SettingsProps>) => {
    if (settings.hideSpecialEpisodes != null) this.hideSpecialEpisodes = settings.hideSpecialEpisodes
    if (settings.hideTBAEpisodes) this.hideTBAEpisodes = settings.hideTBAEpisodes
    if (settings.isAdmin) this.isAdmin = settings.isAdmin
    if (settings.lastUpdated) this.lastUpdated = dayjs(settings.lastUpdated)
    if (settings.searchLinks) this.searchLinks = settings.searchLinks
    if (settings.username) this.username = settings.username
  }

  serialize () {
    return {
      hideSpecialEpisodes: this.hideSpecialEpisodes,
      hideTBAEpisodes: this.hideTBAEpisodes,
      isAdmin: this.isAdmin,
      lastUpdated: this.lastUpdated?.toISOString(),
      searchLinks: toJS(this.searchLinks),
      username: this.username,
    } as SettingsProps
  }
}

export const settingsStore = new SettingsStore()
