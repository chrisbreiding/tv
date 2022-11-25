import { makeObservable, observable } from 'mobx'

class UiState {
  showsLoading = false
  settingsLoading = false
  desktopRunning = false

  constructor () {
    makeObservable(this, {
      showsLoading: observable,
      settingsLoading: observable,
      desktopRunning: observable,
    })
  }
}

export const uiState = new UiState()
