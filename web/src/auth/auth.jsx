import React, { Component } from 'react'

import stats from '../lib/stats'
import cache from '../data/cache'
import { getApiKey, setApiKey } from '../data/api'
import { AutoFocusedInput } from '../lib/form'
import { withRouter } from '../lib/with-router'

class Auth extends Component {
  componentDidMount () {
    stats.send('Visit Auth')
  }

  render () {
    return (
      <div className="auth">
        <form className="form" onSubmit={this._submit.bind(this)}>
          <p>Your API key is missing or invalid. Please authenticate.</p>

          <fieldset>
            <label>API Key</label>
            <AutoFocusedInput ref="apiKey" defaultValue={getApiKey()} />
          </fieldset>

          <footer className="clearfix">
            <button type="submit">Authenticate</button>
          </footer>
        </form>
      </div>
    )
  }

  _submit (e) {
    e.preventDefault()

    const apiKey = this.refs.apiKey.value
    stats.send('Sign In', { apiKey })
    setApiKey(apiKey)
    cache.clear().then(() => {
      this.props.navigate('/shows')
    })
  }
}

export default withRouter(Auth)
