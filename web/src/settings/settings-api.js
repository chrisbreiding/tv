import { action } from 'mobx'

import api from '../data/api'
import cache, { SETTINGS } from '../data/cache'
import settingsStore from '../settings/settings-store'

function getSettingsFromCache () {
  return cache.get(SETTINGS)
}

function getSettingsFromApi () {
  return api.getSettings()
  .then((settings) => {
    if (settings) {
      cache.set(SETTINGS, settings)
      setSettings(settings)
    }
  })
}

const setSettings = action('setSettings', (settings) => {
  settingsStore.setSettings(settings)
  settingsStore.isLoading = false
})

const loadSettings = action('loadSettings', () => {
  settingsStore.isLoading = true

  getSettingsFromCache().then((settings) => {
    if (settings) {
      setSettings(settings)
    }
    getSettingsFromApi()
  })
})

const updateSettings = (settings) => {
  const settingsProps = {
    searchLinks: settings.searchLinks,
  }
  api.updateSettings(settingsProps).then((success) => {
    if (success) {
      setSettings(settingsProps)
      cache.set(SETTINGS, settingsStore.serialize())
    }
  })
}

export {
  loadSettings,
  updateSettings,
}
