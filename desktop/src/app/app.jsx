import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import ipc from '../lib/ipc'

import Notifications from './notifications'
import PlexCredentials from './plex-credentials'
import Queue from './queue'
import TorrentPicker from './torrent-picker'
import Settings from './settings'
import state from './state'

@observer
class App extends Component {
  @observable requestingPlexCredentials = false
  @observable torrents = []

  componentDidMount () {
    ipc.on('notification', action('received:notification', (notification) => {
      state.addNotification(notification)
    }))

    ipc.on('queue:episode:added', action('queue:episode:added', (queueItem) => {
      state.addQueueItem(queueItem)
    }))

    ipc.on('queue:episode:updated', action('queue:episode:updated', (queueItem) => {
      state.updateQueueItem(queueItem)
    }))

    ipc.on('get:plex:credentials:request', action('plex:credentials:requested', () => {
      this.requestingPlexCredentials = true
    }))

    ipc.on('select:torrent:request', action('select:torrent:requested', (torrents) => {
      this.torrents = torrents
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
    if (this.torrents.length) {
      return (
        <TorrentPicker
          torrents={this.torrents}
          onCancel={this._cancelSelectTorrent}
          onSubmit={this._sendSelectedTorrent}
        />
      )
    }

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

  @action _cancelSelectTorrent = () => {
    this.torrents = []
    ipc.send('select:torrent:response', { message: 'User canceled' })
  }

  @action _sendSelectedTorrent = (torrent) => {
    this.torrents = []
    ipc.send('select:torrent:response', null, torrent)
  }
}

export default App
