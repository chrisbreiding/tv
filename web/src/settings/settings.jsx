import Tooltip from '@cypress/react-tooltip'
import {
  faCheck,
  faCircleMinus,
  faMagnifyingGlass,
  faPlus,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cs from 'classnames'
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

const Checkbox = ({ isChecked, onChange }) => {
  const onClick = () => {
    onChange(!isChecked)
  }

  return (
    <button className={cs({ 'is-checked': isChecked })} type="button" onClick={onClick}>
      <FontAwesomeIcon icon={faCheck} />
    </button>
  )
}

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
      hideSpecialEpisodes: settingsStore.hideSpecialEpisodes,
      hideTBAEpisodes: settingsStore.hideTBAEpisodes,
      searchLinks: settingsStore.searchLinks,
    })
  }

  componentDidMount () {
    stats.send('View Settings')

    // react to data changes from cache/api
    this.disposeHideSpecial = reaction(
      () => settingsStore.hideSpecialEpisodes,
      action((hideSpecialEpisodes) => this.hideSpecialEpisodes = hideSpecialEpisodes),
    )
    this.disposeHideTBA = reaction(
      () => settingsStore.hideTBAEpisodes,
      action((hideTBAEpisodes) => this.hideTBAEpisodes = hideTBAEpisodes),
    )
    this.disposeSearchLinks = reaction(
      () => settingsStore.searchLinks,
      action((searchLinks) => this.searchLinks = searchLinks),
    )
  }

  componentWillUnmount () {
    this.disposeHideSpecial()
    this.disposeHideTBA()
    this.disposeSearchLinks()
  }

  render () {
    return (
      <Modal className="settings">
        <Modal.Header>
          <h2>Settings</h2>
        </Modal.Header>
        <Modal.Content>
          <form className="form" onSubmit={this._save}>
            <section className="general">
              <h3>Hide from Recent & Upcoming</h3>
              <label>
                <Checkbox isChecked={this.hideSpecialEpisodes} onChange={this._updateHideSpecialEpisodes} />
                Special episodes
              </label>
              <label>
                <Checkbox isChecked={this.hideTBAEpisodes === 'ALL'} onChange={this._updateHideTBAEpisodes} />
                Episodes where date and title are TBA
              </label>
            </section>

            <section className="search-links">
              <h3>Search Links</h3>
              <p>Search links that appear as <FontAwesomeIcon icon={faMagnifyingGlass} /> when hovering over a show or episode. The following placeholders can be used:</p>
              <p><em>[show name]</em>: The <strong>Search Name</strong> of the show</p>
              <p><em>[episode]</em>: The episode season and number (e.g. s01e12)</p>
              {_.map(this.searchLinks, (link, i) => (
                <SearchLinkEditor link={link} key={i} onRemove={this._removeSearchLink(i)} />
              ))}
              <div className="controls">
                <button type="button" className="add-link alt" onClick={this._addSearchLink}>
                  <FontAwesomeIcon icon={faPlus} /> Add Link
                </button>
              </div>
            </section>
          </form>
        </Modal.Content>
        <div className="spacer" />
        <Modal.Footer okText="Save" onOk={this._save} onCancel={this._cancel}>
          <p>
            Shows & episodes last updated: {date.longString(settingsStore.lastUpdated)}
            {settingsStore.showOutdatedWarning &&
              <Tooltip className="settings-tooltip tooltip" title="Last update was over 24 hours ago">
                <FontAwesomeIcon className="outdated-warning" icon={faTriangleExclamation} />
              </Tooltip>
            }
          </p>
          <div className="spacer" />
        </Modal.Footer>
      </Modal>
    )
  }

  _updateHideSpecialEpisodes = action((bool) => {
    this.hideSpecialEpisodes = bool
  })

  _updateHideTBAEpisodes = action((bool) => {
    this.hideTBAEpisodes = bool ? 'ALL' : 'NONE'
  })

  _addSearchLink = action(() => {
    this.searchLinks.push({
      episodeLink: '',
      name: '',
      showLink: '',
    })
  })

  _removeSearchLink = (index) => action(() => {
    this.searchLinks = [
      ...this.searchLinks.slice(0, index),
      ...this.searchLinks.slice(index + 1),
    ]
  })

  _save = (e) => {
    e.preventDefault()

    stats.send('Update Settings')

    updateSettings({
      hideSpecialEpisodes: this.hideSpecialEpisodes,
      hideTBAEpisodes: this.hideTBAEpisodes,
      searchLinks: this.searchLinks,
    })

    this._close()
  }

  _cancel = action(() => {
    this.hideSpecialEpisodes = settingsStore.hideSpecialEpisodes
    this.hideTBAEpisodes = settingsStore.hideTBAEpisodes
    this.searchLinks = settingsStore.searchLinks

    this._close()
  })

  _close = () => {
    this.props.router.push('/')
  }
}

export default withRouter(observer(Settings))
