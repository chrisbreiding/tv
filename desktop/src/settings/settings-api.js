import ipc from '../lib/ipc'
import settingsStore from './settings-store'
import viewStore from '../lib/view-store'

class SettingsApi {
  load () {
    ipc.on('get:plex:credentials:request', () => {
      settingsStore.setNeedPlexCredentials(true)
      viewStore.showSettings(true)
    })

    ipc('get:settings').then((settings) => {
      settingsStore.update(settings)
    })
  }

  selectDirectory = (directory) => {
    settingsStore.setSelectingDirectory(true)
    ipc('select:directory', directory).then((directoryPath) => {
      if (directoryPath) {
        settingsStore.setDirectory(directory, directoryPath)
      }
    })
  }

  sendPlexCredentials () {
    const authToken = settingsStore.plexToken
    if (!authToken) return

    const event = settingsStore.needPlexCredentials ?
      'get:plex:credentials:response' :
      'set:plex:credentials'
    ipc.send(event, null, { authToken })
  }
}

export default new SettingsApi()
