import _ from 'lodash'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

import ipc from '../lib/ipc'

@observer
class PlexCredentials extends Component {
  @observable requestingPlexCredentials = false

  render () {
    if (!this.requestingPlexCredentials) return null

    return (
      <main className='plex-credentials cover'>
        <form onSubmit={this._submit}>
          <h1>Enter your Plex Auth Token</h1>
          <p>This enables auto-refreshing after a show is added</p>
          <div className='fieldset'>
            <label>Auth Token</label>
            <input ref='authToken' />
          </div>
          <div className='fieldset'>
            <a className='cancel' onClick={this._cancel} href="#">Cancel</a>
            <button>Submit</button>
          </div>
        </form>
      </main>
    )
  }

  componentDidMount () {
    ipc.on('get:plex:credentials:request', action(() => {
      this.requestingPlexCredentials = true
    }))
  }

  componentDidUpdate () {
    if (this.requestingPlexCredentials) {
      this.refs.authToken.focus()
    }
  }

  @action _cancel = (e) => {
    e.preventDefault()
    this.requestingPlexCredentials = false
    ipc.send('get:plex:credentials:response', { message: 'cancel' })
  }

  @action _submit = (e) => {
    e.preventDefault()
    this.requestingPlexCredentials = false
    ipc.send('get:plex:credentials:response', null, {
      authToken: _.trim(this.refs.authToken.value),
    })
  }
}

export default PlexCredentials
