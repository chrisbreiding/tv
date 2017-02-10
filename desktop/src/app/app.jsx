import _ from 'lodash'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import ipc from '../lib/ipc'

import Loader from './loader'
import Notifications from './notifications'
import PlexCredentials from './plex-credentials'
import Settings from './settings'
import state from './state'

@observer
class App extends Component {
  @observable handlingEpisodes = observable.map()
  @observable requestingPlexCredentials = false

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
}

export default App
