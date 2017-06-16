import { action, observable } from 'mobx'

class SettingsStore {
  @observable isLoading = true
  @observable downloadsDirectory = null
  @observable tvShowsDirectory = null
  @observable selectingDirectory = false

  @action update ({ downloads, tvShows }) {
    this.downloadsDirectory = downloads
    this.tvShowsDirectory = tvShows
    this.isLoading = false
  }

  @action setSelectingDirectory (selectingDirectory) {
    this.selectingDirectory = selectingDirectory
  }

  @action setDirectory (name, path) {
    this.setSelectingDirectory(false)
    this[`${name}Directory`] = path
  }
}

export default new SettingsStore()
