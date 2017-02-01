import cs from 'classnames'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import ipc from '../lib/ipc'

import Notifications from './notifications'
import state from './state'

@observer
class App extends Component {
  @observable isLoading = true
  @observable downloadsDirectory = null
  @observable tvShowsDirectory = null
  @observable selectingDirectory = false
  @observable isHandlingEpisode = false

  componentDidMount () {
    ipc('get:directories').then(action('got:directories', ({ downloads, tvShows }) => {
      this.downloadsDirectory = downloads
      this.tvShowsDirectory = tvShows
      this.isLoading = false
    }))

    ipc.on('handling:episode', action('handling:episode', (details) => {
      if (details.title) {
        state.addNotification({
          type: details.type,
          title: details.title,
          message: details.message,
        })
      }
      this.isHandlingEpisode = details.isHandling
    }))
  }

  render () {
    if (this.isLoading) {
      return this._loader('Loading')
    }

    if (this.isHandlingEpisode) {
      return this._loader('Handling episode')
    }

    return (
      <div className='wrap'>
        <main className={cs('settings', {
          selecting: this.selectingDirectory,
        })}>
          <h1>Settings</h1>
          <label>Downloads Directory</label>
          <div className='fieldset'>
            <p>{this.downloadsDirectory}</p>
            <button onClick={this._selectDirectory('downloads')}>
              Select
            </button>
          </div>
          <label>TV Shows Directory</label>
          <div className='fieldset'>
            <p>{this.tvShowsDirectory}</p>
            <button onClick={this._selectDirectory('tvShows')}>
              Select
            </button>
          </div>
          <div className='cover'></div>
        </main>
        <Notifications />
      </div>
    )
  }

  _loader (message) {
    return (
      <div className='loading'>
        <i className='fa fa-soccer-ball-o fa-spin'></i> {message}...
      </div>
    )
  }

  _handlingMessage () {
    if (this.handlingError || !this.isHandlingEpisode) return null

    return this._loader('Handling Episode')
  }

  @action _selectDirectory = (directory) => () => {
    this.selectingDirectory = true
    ipc('select:directory', directory).then(action('selected:directory', (directoryPath) => {
      if (directoryPath) {
        this[`${directory}Directory`] = directoryPath
      }
      this.selectingDirectory = false
    }))
  }
}

export default App
