import _ from 'lodash'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import ipc from '../lib/ipc'

import Loader from './loader'
import Notifications from './notifications'
import PlexCredentials from './plex-credentials'
import TorrentPicker from './torrent-picker'
import Settings from './settings'
import state from './state'

@observer
class App extends Component {
  @observable handlingEpisodes = observable.map()
  @observable requestingPlexCredentials = false
  @observable torrents = []

  componentDidMount () {
    ipc.on('notification', action('received:notification', (notification) => {
      state.addNotification(notification)
    }))

    ipc.on('handling:episode', action('handling:episode', (episode, isHandling) => {
      if (isHandling) {
        this.handlingEpisodes.set(episode.id, episode)
      } else {
        this.handlingEpisodes.delete(episode.id)
      }
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

    if (this.handlingEpisodes.size) {
      return (
        <Loader message={`Handling Episode${this.handlingEpisodes.size > 1 ? 's' : ''}`}>
          {_.map(this.handlingEpisodes.values(), (episode) => (
            <p key={episode.id}>{episode.fileName}</p>
          ))}
        </Loader>
      )
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
