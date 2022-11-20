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

const setSettings = (settings) => {
  settingsStore.setSettings(settings)
  settingsStore.setIsLoading(false)
}

const loadSettings = () => {
  settingsStore.setIsLoading(true)

  getSettingsFromCache().then((settings) => {
    if (settings) {
      setSettings(settings)
    }
    getSettingsFromApi()
  })
}

const updateSettings = (settings) => {
  const settingsProps = {
    hideSpecialEpisodes: settings.hideSpecialEpisodes,
    hideTBAEpisodes: settings.hideTBAEpisodes,
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
