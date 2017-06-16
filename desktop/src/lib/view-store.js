import { action, computed, observable } from 'mobx'

class ViewStore {
  @observable currentView = { name: 'queue' }

  @computed get isQueue () {
    return this.currentView.name === 'queue'
  }

  @computed get isSettings () {
    return this.currentView.name === 'settings'
  }

  @action showQueue = () => {
    this.currentView = {
      name: 'queue',
    }
  }

  @action showSettings = () => {
    this.currentView = {
      name: 'settings',
    }
  }
}

export default new ViewStore()
