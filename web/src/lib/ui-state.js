import { extendObservable } from 'mobx'

class UiState {
  constructor () {
    extendObservable(this, {
      showsLoading: false,
      settingsLoading: false,
      desktopRunning: false,
    })
  }
}

export default new UiState()
