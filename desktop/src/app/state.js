import _ from 'lodash'
import { observable } from 'mobx'

class State {
  @observable notifications = []

  addNotification (notification) {
    notification.id = _.uniqueId()
    this.notifications.push(notification)
  }

  removeNotification (id) {
    const index = _.findIndex(this.notifications, { id })
    this.notifications.splice(index, 1)
  }
}

export default new State()
