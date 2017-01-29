import cs from 'classnames'
import _ from 'lodash'
import React, { Component } from 'react'
import ipc from '../lib/ipc'

class App extends Component {
  state = {
    directories: {},
    isLoading: true,
    selectingDirectory: false,
  }

  componentDidMount () {
    ipc('get:directories').then((directories) => {
      this.setState({
        directories,
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
          <p>{this.state.directories.downloads}</p>
          <button onClick={this._selectDirectory('downloads')}>
            Select
          </button>
        </div>
        <label>TV Shows Directory</label>
        <div className='fieldset'>
          <p>{this.state.directories.tvShows}</p>
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
      debugger
      if (directoryPath) {
        this.setState({
          directories: _.extend({}, this.state.directories, {
            [directory]: directoryPath,
          }),
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
