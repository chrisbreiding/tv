import { action, observable } from 'mobx'

class SettingsStore {
  @observable isLoading = true
  @observable downloadsDirectory = null
  @observable tvShowsDirectory = null
  @observable selectingDirectory = false
  @observable needPlexCredentials = false
  @observable plexToken

  @action update (settings) {
    const { downloads, tvShows } = settings.directories
    this.downloadsDirectory = downloads
    this.tvShowsDirectory = tvShows
    this.plexToken = settings.plexToken
    this.isLoading = false
  }

  @action setSelectingDirectory (selectingDirectory) {
    this.selectingDirectory = selectingDirectory
  }

  @action setDirectory (name, path) {
    this.setSelectingDirectory(false)
    this[`${name}Directory`] = path
  }

  @action setPlexToken = (plexToken) => {
    this.plexToken = plexToken
  }

  @action setNeedPlexCredentials (needPlexCredentials) {
    this.needPlexCredentials = needPlexCredentials
  }
}

export default new SettingsStore()
