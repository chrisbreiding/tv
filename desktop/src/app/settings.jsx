import cs from 'classnames'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

import Loader from './loader'
import ipc from '../lib/ipc'

@observer
class Settings extends Component {
  @observable isLoading = true
  @observable downloadsDirectory = null
  @observable tvShowsDirectory = null
  @observable selectingDirectory = false

  componentDidMount () {
    ipc('get:directories').then(action('got:directories', ({ downloads, tvShows }) => {
      this.downloadsDirectory = downloads
      this.tvShowsDirectory = tvShows
      this.isLoading = false
    }))
  }

  render () {
    if (this.isLoading) {
      return <Loader message='Loading' />
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

export default Settings
