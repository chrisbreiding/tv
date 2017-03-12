import { action, reaction, observable } from 'mobx'
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
  @observable searchLink = settingsStore.searchLink

  componentDidMount () {
    this.dispose = reaction(
      () => settingsStore.searchLink,
      action((searchLink) => this.searchLink = searchLink)
    )
  }

  componentWillUnmount () {
    this.dispose()
  }

  render () {
    return (
      <Modal className="settings">
        <Modal.Header onClose={this._close}>
          <h2>Settings</h2>
        </Modal.Header>
        <Modal.Content>
          <form className="form" onSubmit={this._save}>
            <fieldset>
              <label>Search Link</label>
              <AutoFocusedInput
                ref="searchLink"
                value={this.searchLink}
                onChange={this._updateSearchLink}
              />
            </fieldset>
          </form>
        </Modal.Content>
        <Modal.Footer>
          <p>Last updated: {date.longString(settingsStore.lastUpdated)}</p>
          <button type="submit" onClick={this._save}>Save</button>
        </Modal.Footer>
      </Modal>
    )
  }

  @action _updateSearchLink = () => {
    this.searchLink = this.refs.searchLink.value
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
