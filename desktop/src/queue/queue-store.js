import { action, computed, observable } from 'mobx'

import QueueItemModel, { states } from './queue-item-model'

class QueueStore {
  @observable isLoading = true
  @observable queue = observable.map()

  @computed get size () {
    return this.queue.size
  }

  @computed get items () {
    return this.queue.values()
  }

  has ({ id }) {
    return this.queue.has(id)
  }

  isCancelable (queueItemProps) {
    switch (queueItemProps.state) {
      case states.SEARCHING_TORRENTS:
      case states.ADDING_TORRENT:
      case states.DOWNLOADING_TORRENT:
        return true
      default:
        return false
    }
  }

  @action setLoading (isLoading) {
    this.isLoading = isLoading
  }

  @action add (queueItemProps) {
    this.queue.set(queueItemProps.id, new QueueItemModel(queueItemProps))
  }

  @action update (queueItemProps) {
    this.queue.get(queueItemProps.id).update(queueItemProps)
  }

  @action remove ({ id }) {
    this.queue.delete(id)
  }
}

export default new QueueStore()
