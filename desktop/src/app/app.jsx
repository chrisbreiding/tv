import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import ipc from '../lib/ipc'

import Notifications from './notifications'
import PlexCredentials from '../plex/plex-credentials'
import Queue from '../queue/queue'
import Settings from '../settings/settings'
import state from '../lib/state'

@observer
class App extends Component {
  @observable requestingPlexCredentials = false

  componentDidMount () {
    ipc.on('notification', action((notification) => {
      state.addNotification(notification)
    }))

    ipc.on('queue:episode:added', action((queueItem) => {
      state.addQueueItem(queueItem)
    }))

    ipc.on('queue:episode:updated', action((queueItem) => {
      state.updateQueueItem(queueItem)
    }))

    ipc.on('get:plex:credentials:request', action(() => {
      this.requestingPlexCredentials = true
    }))

    ipc.on('select:torrent:request', action((id, torrents) => {
      const clear = action(() => {
        state.updateQueueItem({ id, torrents: [], onCancel: null, onSelect: null })
      })
      const respond = (...args) => ipc.send(`select:torrent:response:${id}`, ...args)

      state.updateQueueItem({ id, torrents,
        onCancel ()        { clear(); respond({ message: 'User canceled' }) },
        onSelect (torrent) { clear(); respond(null, torrent) },
      })
    }))

    ipc.on('select:file:request', action((id, files) => {
      const clear = action(() => {
        state.updateQueueItem({ id, files: [], onCancel: null, onSelect: null })
      })
      const respond = (...args) => ipc.send(`select:file:response:${id}`, ...args)

      state.updateQueueItem({ id, files,
        onCancel ()     { clear(); respond({ message: 'User canceled' }) },
        onSelect (file) { clear(); respond(null, file) },
      })
    }))
  }

  render () {
    return (
      <div className='wrap'>
        {this._content()}
        <Notifications />
      </div>
    )
  }

  _content () {
    if (this.requestingPlexCredentials) {
      return (
        <PlexCredentials
          onCancel={this._cancelPlexCredentials}
          onSubmit={this._sendPlexCredentials}
        />
      )
    }

    if (state.hasQueueItems) {
      return <Queue />
    }

    return <Settings />
  }

  @action _cancelPlexCredentials = () => {
    this.requestingPlexCredentials = false
    ipc.send('get:plex:credentials:response', { message: 'User canceled' })
  }

  @action _sendPlexCredentials = (credentials) => {
    this.requestingPlexCredentials = false
    ipc.send('get:plex:credentials:response', null, credentials)
  }
}

export default App
