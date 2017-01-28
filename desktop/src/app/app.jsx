import React, { Component } from 'react'
import ipc from '../lib/ipc'

class App extends Component {
  state = {
    directories: {},
    isLoading: true,
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
      <main>
        <fieldset>
          <label>Downloads Directory</label>
          <p>{this.state.directories.downloads}</p>
        </fieldset>
        <fieldset>
          <label>TV Shows Directory</label>
          <p>{this.state.directories.tvShows}</p>
        </fieldset>
      </main>
    )
  }
}

export default App
