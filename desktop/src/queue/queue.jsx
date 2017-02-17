import _ from 'lodash'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

import QueueItem from './queue-item'
import QueueItemModel, { states } from './queue-item-model'

import ipc from '../lib/ipc'

@observer
class Queue extends Component {
  @observable queue = observable.map()

  render () {
    if (!this.queue.size) return null

    return (
      <main className='queue'>
        <h1>Queue</h1>
        <ul>
          {_.map(this.queue.values(), (queueItem) => (
            <QueueItem
              key={queueItem.id}
              queueItem={queueItem}
              onRemove={this._remove(queueItem.id)}
            />
          ))}
        </ul>
      </main>
    )
  }

  componentDidMount () {
    ipc('fetch:queue').then(action((queueItems) => {
      _.each(queueItems, (queueItem) => {
        this._add(queueItem)
        if (queueItem.state === states.SELECT_TORRENT) {
          this._handleSelect(queueItem.id, 'torrent')
        } else if (queueItem.state === states.SELECT_FILE) {
          this._handleSelect(queueItem.id, 'file')
        }
      })
    }))

    ipc.on('queue:episode:added', action((queueItem) => {
      this._add(queueItem)
    }))

    ipc.on('queue:episode:updated', action((queueItem) => {
      this._update(queueItem)
    }))

    ipc.on('select:torrent:request', action((id) => {
      this._handleSelect(id, 'torrent')
    }))

    ipc.on('select:file:request', action((id) => {
      this._handleSelect(id, 'file')
    }))
  }

  _add (queueItem) {
    this._handleCancelCallback(queueItem)
    this.queue.set(queueItem.id, new QueueItemModel(queueItem))
  }

  @action _update (queueItem) {
    if (this.queue.has(queueItem.id)) {
      this._handleCancelCallback(queueItem)
      _.extend(this.queue.get(queueItem.id), queueItem)
    }
  }

  _handleCancelCallback (queueItem) {
    if (this._isCancelable(queueItem)) {
      queueItem.onCancel = () => {
        queueItem.onCancel = null
        ipc.send(`cancel:queue:item:${queueItem.id}`)
      }
    }
  }

  _isCancelable (queueItem) {
    return (
      queueItem.state === states.SEARCHING_TORRENTS ||
      queueItem.state === states.DOWNLOADING_TORRENT
    )
  }

  _remove = (id) => () => {
    this.queue.delete(id)
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

export default Queue
