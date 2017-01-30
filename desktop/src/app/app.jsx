import cs from 'classnames'
import React, { Component } from 'react'
import ipc from '../lib/ipc'

class App extends Component {
  state = {
    isLoading: true,
    downloadsDirectory: null,
    tvShowsDirectory: null,
    selectingDirectory: false,
  }

  componentDidMount () {
    ipc('get:directories').then(({ downloads, tvShows }) => {
      this.setState({
        downloadsDirectory: downloads,
        tvShowsDirectory: tvShows,
        isLoading: false,
      })
    })
  }

  render () {
    if (this.state.isLoading) {
      return (
        <div className='loading'>
          <i className='fa fa-soccer-ball-o fa-spin'></i> Loading...
        </div>
      )
    }

    return (
      <main className={cs('settings', {
        selecting: this.state.selectingDirectory,
      })}>
        <h1>Settings</h1>
        <label>Downloads Directory</label>
        <div className='fieldset'>
          <p>{this.state.downloadsDirectory}</p>
          <button onClick={this._selectDirectory('downloads')}>
            Select
          </button>
        </div>
        <label>TV Shows Directory</label>
        <div className='fieldset'>
          <p>{this.state.tvShowsDirectory}</p>
          <button onClick={this._selectDirectory('tvShows')}>
            Select
          </button>
        </div>
        <div className='cover'></div>
      </main>
    )
  }

  _selectDirectory = (directory) => () => {
    this.setState({ selectingDirectory: true })
    ipc('select:directory', directory).then((directoryPath) => {
      if (directoryPath) {
        this.setState({
          [`${directory}Directory`]: directoryPath,
          selectingDirectory: false,
        })
      } else {
        this.setState({
          selectingDirectory: false,
        })
      }
    })
  }
}

export default App
