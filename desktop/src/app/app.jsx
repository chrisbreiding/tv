import cs from 'classnames'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

import queueApi from '../queue/queue-api'
import settingsApi from '../settings/settings-api'
import viewStore from '../lib/view-store'

import Notifications from './notifications'
import PlexCredentials from '../plex/plex-credentials'
import Queue from '../queue/queue'
import Settings from '../settings/settings'

@observer
class App extends Component {
  componentDidMount () {
    queueApi.listen()
    settingsApi.load()
  }

  render () {
    return (
      <div className='wrap'>
        <nav>
          <button
            onClick={viewStore.showQueue}
            className={cs({ 'is-active': viewStore.isQueue })}
          >
            Queue
          </button>
          <button
            onClick={viewStore.showSettings}
            className={cs({ 'is-active': viewStore.isSettings })}
          >
            Settings
          </button>
        </nav>
        {viewStore.isQueue && <Queue />}
        {viewStore.isSettings && <Settings />}
        <PlexCredentials />
        <Notifications />
      </div>
    )
  }
}

export default App
