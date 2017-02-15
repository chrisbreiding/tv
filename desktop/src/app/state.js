import _ from 'lodash'
import { computed, observable } from 'mobx'

class QueueItem {
  @observable id
  @observable state
  @observable episode
  @observable info
  @observable torrents = []
  @observable files = []

  constructor (props) {
    this.id = props.id
    this.state = props.state
    this.episode = props.episode
  }
}

class State {
  @observable notifications = []
  @observable queue = observable.map()

  @computed get hasQueueItems () {
    return !!this.queue.size
  }

  addNotification (notification) {
    notification.id = _.uniqueId()
    notification.title = notification.title || ''
    notification.message = notification.message || ''
    this.notifications.push(notification)
  }

  removeNotification (id) {
    const index = _.findIndex(this.notifications, { id })
    this.notifications.splice(index, 1)
  }

  addQueueItem (queueItem) {
    this.queue.set(queueItem.id, new QueueItem(queueItem))
  }

  updateQueueItem (queueItem) {
    if (this.queue.has(queueItem.id)) {
      _.extend(this.queue.get(queueItem.id), queueItem)
    }
  }

  removeQueueItem (queueItem) {
    this.queue.delete(queueItem.id)
  }
}

export default new State()
