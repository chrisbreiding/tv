import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { withRouter } from 'react-router'

import Modal from '../modal/modal'
import date from '../lib/date'
import { AutoFocusedInput } from '../lib/form'
import { updateSettings } from './settings-api'
import settingsStore from './settings-store'

@withRouter
@observer
export default class Settings extends Component {
  render () {
    return (
      <Modal className="settings" onClose={this._close} footerContent={this._controls()}>
        <form className="form" onSubmit={this._save}>
          <fieldset>
            <label>Search Link</label>
            <AutoFocusedInput ref="searchLink" defaultValue={settingsStore.searchLink} />
          </fieldset>
        </form>
      </Modal>
    )
  }

  _controls () {
    return (
      <div className="controls">
        <p>Last updated: {date.longString(settingsStore.lastUpdated)}</p>
        <button type="submit" onClick={this._save}>Save</button>
      </div>
    )
  }

  _save = (e) => {
    e.preventDefault()
    updateSettings({
      searchLink: this.refs.searchLink.value,
    })
    this._close()
  }

  _close = () => {
    this.props.router.push('/')
  }
}
