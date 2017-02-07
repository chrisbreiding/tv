import _ from 'lodash'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import ipc from '../lib/ipc'

import Loader from './loader'
import Notifications from './notifications'
import Settings from './settings'
import state from './state'

@observer
class App extends Component {
  @observable handlingEpisodes = observable.map()

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
}

export default App
