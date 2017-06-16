import _ from 'lodash'

import ipc from '../lib/ipc'
import { states } from './queue-item-model'
import queueStore from './queue-store'

class QueueApi {
  listen () {
    ipc('fetch:queue').then((queueItems) => {
      queueStore.setLoading(false)
      _.each(queueItems, (queueItem) => {
        this._add(queueItem)
        if (queueItem.state === states.SELECT_TORRENT) {
          this._handleSelect(queueItem.id, 'torrent')
        } else if (queueItem.state === states.SELECT_FILE) {
          this._handleSelect(queueItem.id, 'file')
        }
      })
    })

    ipc.on('queue:episode:added', (queueItem) => {
      this._add(queueItem)
    })

    ipc.on('queue:episode:updated', (queueItem) => {
      this._update(queueItem)
    })

    ipc.on('select:torrent:request', (id) => {
      this._handleSelect(id, 'torrent')
    })

    ipc.on('select:file:request', (id) => {
      this._handleSelect(id, 'file')
    })
  }

  remove (queueItem)  {
    queueStore.remove(queueItem)
  }

  _add (queueItemProps) {
    this._handleCancelCallback(queueItemProps)
    queueStore.add(queueItemProps)
  }

  _update (queueItemProps) {
    if (queueStore.has(queueItemProps)) {
      this._handleCancelCallback(queueItemProps)
      queueStore.update(queueItemProps)
    }
  }

  _handleCancelCallback (queueItemProps) {
    if (queueStore.isCancelable(queueItemProps)) {
      queueItemProps.onCancel = () => {
        queueItemProps.onCancel = null
        ipc.send(`cancel:queue:item:${queueItemProps.id}`)
      }
    }
  }

  _handleSelect (id, type) {
    const respond = (...args) => {
      this._update({ id, onCancel: null, onSelect: null })
      ipc.send(`select:${type}:response:${id}`, ...args)
    }

    this._update({
      id,
      onCancel ()          { respond({ message: 'cancel' }) },
      onSelect (selection) { respond(null, selection) },
    })
  }
}

export default new QueueApi()
