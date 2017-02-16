import _ from 'lodash'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

import QueueItem from './queue-item'
import QueueItemModel from './queue-item-model'

import ipc from '../lib/ipc'

const SELECT_TORRENT = 'SELECT_TORRENT'
const SELECT_FILE = 'SELECT_FILE'

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
      console.log(queueItems)
      _.each(queueItems, (queueItem) => {
        this._add(queueItem)
        if (queueItem.state === SELECT_TORRENT) {
          this._handleSelect(queueItem.id, 'torrent')
        } else if (queueItem.state === SELECT_FILE) {
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
    this.queue.set(queueItem.id, new QueueItemModel(queueItem))
  }

  @action _update (queueItem) {
    if (this.queue.has(queueItem.id)) {
      _.extend(this.queue.get(queueItem.id), queueItem)
    }
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
      onCancel ()          { respond({ message: 'User canceled' }) },
      onSelect (selection) { respond(null, selection) },
    })
  }
}

export default Queue
