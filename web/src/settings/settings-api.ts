import { cache, SETTINGS_KEY } from '../data/cache'
import {
  getSettings as getRemoteSettings,
  updateSettings as updateRemoteSettings,
} from '../data/remote'
import type { SettingsProps, UpdateSettingsProps } from '../lib/types'
import { settingsStore } from './settings-store'

function getSettingsFromCache<T> () {
  return cache.get<T>(SETTINGS_KEY)
}

async function getSettingsFromApi () {
  const settings = await getRemoteSettings()

  if (settings) {
    cache.set<SettingsProps>(SETTINGS_KEY, settings)
    setSettings(settings)
  }
}

function setSettings (settings: UpdateSettingsProps) {
  settingsStore.setSettings(settings)
  settingsStore.setIsLoading(false)
}

export function loadSettings () {
  settingsStore.setIsLoading(true)

  getSettingsFromCache<SettingsProps>().then((settings) => {
    if (settings) {
      setSettings(settings)
    }
    getSettingsFromApi()
  })
}

export async function updateSettings (settings: UpdateSettingsProps) {
  const settingsProps = {
    hideSpecialEpisodes: settings.hideSpecialEpisodes,
    hideTBAEpisodes: settings.hideTBAEpisodes,
    searchLinks: settings.searchLinks,
  }

  const success = await updateRemoteSettings(settingsProps)

  if (success) {
    setSettings(settingsProps)
    cache.set<SettingsProps>(SETTINGS_KEY, settingsStore.serialize())
  }
}
