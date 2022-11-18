import { extendObservable } from 'mobx'
import moment from 'moment'

class SettingsStore {
  constructor () {
    extendObservable(this, {
      lastUpdated: null,
      searchLinks: [],
      isLoading: false,
    })
  }

  setSettings (settings) {
    if (settings.lastUpdated) this.lastUpdated = moment(settings.lastUpdated)
    if (settings.searchLinks) this.searchLinks = settings.searchLinks
  }

  serialize () {
    return {
      lastUpdated: this.lastUpdated.toISOString(),
      searchLinks: this.searchLinks,
    }
  }
}

export default new SettingsStore()
