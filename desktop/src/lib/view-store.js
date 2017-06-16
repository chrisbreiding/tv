import { action, computed, observable } from 'mobx'

class ViewStore {
  @observable currentView = 'queue'

  @computed get isQueue () {
    return this.currentView === 'queue'
  }

  @computed get isSettings () {
    return this.currentView === 'settings'
  }

  @action showQueue = () => {
    this.currentView = 'queue'
  }

  @action showSettings = () => {
    this.currentView = 'settings'
  }
}

export default new ViewStore()
