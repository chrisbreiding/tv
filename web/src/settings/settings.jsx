import { faCircleMinus, faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import _ from 'lodash'
import { action, reaction, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { withRouter } from 'react-router'

import stats from '../lib/stats'
import Modal from '../modal/modal'
import date from '../lib/date'
import { updateSettings } from './settings-api'
import settingsStore from './settings-store'

const SearchLinkEditor = observer(({ link, onRemove }) => {
  const onChange = (field) => action((e) => {
    link[field] = e.target.value
  })

  const _onRemove = (e) => {
    e.preventDefault()
    onRemove()
  }

  return (
    <fieldset>
      <label>Name</label>
      <input value={link.name} onChange={onChange('name')} />
      <label>Show Link</label>
      <input value={link.showLink} onChange={onChange('showLink')} />
      <label>Episode Link</label>
      <input value={link.episodeLink} onChange={onChange('episodeLink')} />
      <a className="delete" onClick={_onRemove} href="#">
        <FontAwesomeIcon icon={faCircleMinus} /> Delete
      </a>
    </fieldset>
  )
})

class Settings extends Component {
  constructor (props) {
    super(props)

    extendObservable(this, {
      searchLinks: settingsStore.searchLinks,
    })
  }

  componentDidMount () {
    stats.send('View Settings')

    this.dispose = reaction(
      () => settingsStore.searchLinks,
      action((searchLinks) => this.searchLinks = searchLinks),
    )
  }

  componentWillUnmount () {
    this.dispose()
  }

  render () {
    return (
      <Modal className="settings">
        <Modal.Header>
          <h2>Settings</h2>
        </Modal.Header>
        <Modal.Content>
          <form className="form" onSubmit={this._save}>
            <h3>Search Links</h3>
            <p>Search links that appear as <FontAwesomeIcon icon={faMagnifyingGlass} /> when hovering over a show or episode. The following placeholders can be used:</p>
            <p><em>[show name]</em>: The <strong>Search Name</strong> of the show</p>
            <p><em>[episode]</em>: The episode season and number (e.g. s01e12)</p>
            {_.map(this.searchLinks, (link, i) => (
              <SearchLinkEditor link={link} key={i} onRemove={this._onRemove(i)} />
            ))}
            <div className="controls">
              <button type="button" className="add-link alt" onClick={this._add}>
                <FontAwesomeIcon icon={faPlus} /> Add Link
              </button>
            </div>
          </form>
        </Modal.Content>
        <div className="spacer" />
        <Modal.Footer okText="Save" onOk={this._save} onCancel={this._cancel}>
          <p>Shows & episodes last updated: {date.longString(settingsStore.lastUpdated)}</p>
          <div className="spacer" />
        </Modal.Footer>
      </Modal>
    )
  }

  _add = action(() => {
    this.searchLinks.push({
      episodeLink: '',
      name: '',
      showLink: '',
    })
  })

  _onRemove = (index) => action(() => {
    this.searchLinks = [
      ...this.searchLinks.slice(0, index),
      ...this.searchLinks.slice(index + 1),
    ]
  })

  _save = (e) => {
    e.preventDefault()

    stats.send('Update Search Link', {
      from: settingsStore.searchLinks,
      to: this.searchLinks,
    })

    updateSettings({ searchLinks: this.searchLinks })

    this._close()
  }

  _cancel = action(() => {
    this.searchLinks = settingsStore.searchLinks
    this._close()
  })

  _close = () => {
    this.props.router.push('/')
  }
}

export default withRouter(observer(Settings))
