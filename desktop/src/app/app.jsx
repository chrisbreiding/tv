import cs from 'classnames'
import React, { Component } from 'react'
import ipc from '../lib/ipc'

class App extends Component {
  state = {
    isLoading: true,
    tvShowsDirectory: null,
    selectingDirectory: false,
  }

  componentDidMount () {
    ipc('get:directories').then(({ tvShows }) => {
      this.setState({
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
        <label>TV Shows Directory</label>
        <div className='fieldset'>
          <p>{this.state.tvShowsDirectory}</p>
          <button onClick={this._selectDirectory}>
            Select
          </button>
        </div>
        <div className='cover'></div>
      </main>
    )
  }

  _selectDirectory = () => {
    this.setState({ selectingDirectory: true })
    ipc('select:directory', 'tvShows').then((directoryPath) => {
      if (directoryPath) {
        this.setState({
          tvShowsDirectory: directoryPath,
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
