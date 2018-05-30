import _ from 'lodash'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

@observer
class PlexCredentials extends Component {
  render () {
    return (
      <form onSubmit={this._submit}>
        <label>Plex Token</label>
        <div className='fieldset'>
          <input ref='authToken' value={this.props.plexToken} onChange={this._update} />
          <button>Save</button>
        </div>
      </form>
    )
  }

  componentDidMount () {
    this._focus()
  }

  componentDidUpdate () {
    this._focus()
  }

  _focus () {
    if (this.props.shouldFocus) {
      this.refs.authToken.focus()
    }
  }

  _update = (e) => {
    this.props.onUpdate(_.trim(e.target.value))
  }

  _submit = (e) => {
    e.preventDefault()
    this.props.onSave()
  }
}

export default PlexCredentials
