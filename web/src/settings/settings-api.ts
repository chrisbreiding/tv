import { cache, SETTINGS_KEY } from '../data/cache'
import {
  getSettings as getRemoteSettings,
  updateSettings as updateRemoteSettings,
} from '../data/remote'
import type { SettingsProps, UpdateSettingsProps } from '../lib/types'
import { settingsStore } from './settings-store'

async function getSettingsFromRemote () {
  const settings = await getRemoteSettings()

  if (settings) {
    settingsStore.setSettings(settings)
    settingsStore.setIsLoadingFromRemote(false)
    settingsStore.setIsLoadingFromCache(false)
    cache.set<SettingsProps>(SETTINGS_KEY, settings)
  }
}

export function loadSettings () {
  settingsStore.setIsLoadingFromRemote(true)
  settingsStore.setIsLoadingFromCache(true)

  cache.get<SettingsProps>(SETTINGS_KEY).then((settings) => {
    if (settings) {
      settingsStore.setSettings(settings)
      settingsStore.setIsLoadingFromCache(false)
    }
    getSettingsFromRemote()
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
    settingsStore.setSettings(settings)
    cache.set<SettingsProps>(SETTINGS_KEY, settingsStore.serialize())
  }
}
