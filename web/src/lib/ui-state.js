import { observable } from 'mobx'

class UiState {
  @observable showsLoading = false
  @observable settingsLoading = false
  @observable desktopRunning = false
}

export default new UiState()
