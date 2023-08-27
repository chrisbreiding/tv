import { action, computed, makeObservable, observable, toJS } from 'mobx'
import dayjs from 'dayjs'
import type { SettingsProps } from '../lib/types'
import { now } from '../lib/date'

interface SearchLink {
  name: string
  showLink: string
  episodeLink: string
}

interface UserSettingsShape {
  hideSpecialEpisodes: boolean
  hideTBAEpisodes: SettingsProps['hideTBAEpisodes']
  preferredView: 'list' | 'calendar'
  searchLinks: SearchLink[]
}

class SettingsStore {
  hideSpecialEpisodes = false
  hideTBAEpisodes: SettingsProps['hideTBAEpisodes'] = 'NONE'
  isAdmin = false
  isLoadingFromRemote = true
  isLoadingFromCache = true
  lastUpdated?: dayjs.Dayjs
  preferredView: SettingsProps['preferredView'] = localStorage.preferredView || 'list'
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
      preferredView: observable,
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
    if (this.isLoadingFromRemote) return false

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
    if (settings.preferredView) this.preferredView = settings.preferredView
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

  serializeUserSettings (context: UserSettingsShape) {
    return {
      hideSpecialEpisodes: context.hideSpecialEpisodes,
      hideTBAEpisodes: context.hideTBAEpisodes,
      preferredView: context.preferredView,
      searchLinks: toJS(context.searchLinks),
    }
  }
}

export const settingsStore = new SettingsStore()
