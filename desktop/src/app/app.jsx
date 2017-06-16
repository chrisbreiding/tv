import cs from 'classnames'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

import queueApi from '../queue/queue-api'
import settingsApi from '../settings/settings-api'
import viewStore from '../lib/view-store'

import Notifications from './notifications'
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
      <div className={cs('wrap cover', {
        'is-queue': viewStore.isQueue,
        'is-settings': viewStore.isSettings,
      })}>
        <nav>
          <button className='nav-queue' onClick={viewStore.showQueue}>
            Queue
          </button>
          <button className='nav-settings' onClick={viewStore.showSettings}>
            Settings
          </button>
        </nav>
        <Queue />
        <Settings />
        <Notifications />
      </div>
    )
  }
}

export default App
