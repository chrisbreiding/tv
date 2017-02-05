import cs from 'classnames'
import _ from 'lodash'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import ipc from '../lib/ipc'

import Notifications from './notifications'
import state from './state'

const Loader = ({ children, message }) => (
  <main className='loading'>
    <p>
      <span><i className='fa fa-soccer-ball-o fa-spin'></i></span>
      {message}...
    </p>
    {children}
  </main>
)

@observer
class App extends Component {
  @observable isLoading = true
  @observable downloadsDirectory = null
  @observable tvShowsDirectory = null
  @observable selectingDirectory = false
  @observable handlingEpisodes = observable.map()

  componentDidMount () {
    ipc('get:directories').then(action('got:directories', ({ downloads, tvShows }) => {
      this.downloadsDirectory = downloads
      this.tvShowsDirectory = tvShows
      this.isLoading = false
    }))

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
    if (this.isLoading) {
      return <Loader message='Loading' />
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

    return (
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
    )
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
