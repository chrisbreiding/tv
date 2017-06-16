import ipc from '../lib/ipc'
import settingsStore from './settings-store'

class SettingsApi {
  load () {
    ipc('get:directories').then((directories) => {
      settingsStore.update(directories)
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
}

export default new SettingsApi()
