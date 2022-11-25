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
import { action, reaction } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { sendStats } from '../data/remote'
import { longString } from '../lib/date'
import type { SearchLink } from '../lib/types'
import { Modal, ModalContent, ModalFooter, ModalHeader } from '../modal/modal'
import { updateSettings } from './settings-api'
import { settingsStore } from './settings-store'

interface CheckboxProps {
  isChecked: boolean
  onChange: (isChecked: boolean) => void
}

const Checkbox = ({ isChecked, onChange }: CheckboxProps) => {
  const onClick = () => {
    onChange(!isChecked)
  }

  return (
    <button className={cs({ 'is-checked': isChecked })} type="button" onClick={onClick}>
      <FontAwesomeIcon icon={faCheck} />
    </button>
  )
}

interface SearchLinkEditorProps {
  link: SearchLink
  onRemove: () => void
}

const SearchLinkEditor = observer(({ link, onRemove }: SearchLinkEditorProps) => {
  const onChange = (field: 'name' | 'showLink' | 'episodeLink') => (
    action((e: React.ChangeEvent<HTMLInputElement>) => {
      link[field] = e.target.value
    })
  )

  const _onRemove = (e: React.MouseEvent<HTMLAnchorElement>) => {
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

export const Settings = observer(() => {
  const navigate = useNavigate()
  const state = useLocalObservable(() => ({
    hideSpecialEpisodes: settingsStore.hideSpecialEpisodes,
    hideTBAEpisodes: settingsStore.hideTBAEpisodes,
    searchLinks: settingsStore.searchLinks,

    updateHideSpecialEpisodes (hide: boolean) {
      this.hideSpecialEpisodes = hide
    },
    updateHideTBAEpisodes (hide: boolean) {
      this.hideTBAEpisodes = hide ? 'ALL' : 'NONE'
    },
    addSearchLink () {
      this.searchLinks.push({
        episodeLink: '',
        name: '',
        showLink: '',
      })
    },
    removeSearchLink (index: number) {
      this.searchLinks = [
        ...this.searchLinks.slice(0, index),
        ...this.searchLinks.slice(index + 1),
      ]
    },
    reset () {
      this.hideSpecialEpisodes = settingsStore.hideSpecialEpisodes
      this.hideTBAEpisodes = settingsStore.hideTBAEpisodes
      this.searchLinks = settingsStore.searchLinks
    },
  }))

  useEffect(() => {
    sendStats('View Settings')

    // react to data changes from cache/api
    const disposers = [
      reaction(
        () => settingsStore.hideSpecialEpisodes,
        action((hideSpecialEpisodes) => state.hideSpecialEpisodes = hideSpecialEpisodes),
      ),
      reaction(
        () => settingsStore.hideTBAEpisodes,
        action((hideTBAEpisodes) => state.hideTBAEpisodes = hideTBAEpisodes),
      ),
      reaction(
        () => settingsStore.searchLinks,
        action((searchLinks) => state.searchLinks = searchLinks),
      ),
    ]

    return () => {
      disposers.forEach((dispose) => dispose())
    }
  }, [true])

  const save = () => {
    sendStats('Update Settings')

    updateSettings({
      hideSpecialEpisodes: state.hideSpecialEpisodes,
      hideTBAEpisodes: state.hideTBAEpisodes,
      searchLinks: state.searchLinks,
    })

    close()
  }

  const cancel = () => {
    state.reset()

    close()
  }

  const close = () => {
    navigate('/')
  }

  return (
    <Modal className="settings">
      <ModalHeader>
        <h2>Settings</h2>
      </ModalHeader>
      <ModalContent>
        <form className="form" onSubmit={save}>
          <section className="general">
            <h3>Hide from Recent & Upcoming</h3>
            <label>
              <Checkbox isChecked={state.hideSpecialEpisodes} onChange={state.updateHideSpecialEpisodes} />
              Special episodes
            </label>
            <label>
              <Checkbox isChecked={state.hideTBAEpisodes === 'ALL'} onChange={state.updateHideTBAEpisodes} />
              Episodes where date and title are TBA
            </label>
          </section>

          <section className="search-links">
            <h3>Search Links</h3>
            <p>Search links that appear as <FontAwesomeIcon icon={faMagnifyingGlass} /> when hovering over a show or episode. The following placeholders can be used:</p>
            <p><em>[show name]</em>: The <strong>Search Name</strong> of the show</p>
            <p><em>[episode]</em>: The episode season and number (e.g. s01e12)</p>
            {state.searchLinks.map((link, i) => (
              <SearchLinkEditor link={link} key={i} onRemove={state.removeSearchLink.bind(state, i)} />
            ))}
            <div className="controls">
              <button type="button" className="add-link alt" onClick={state.addSearchLink}>
                <FontAwesomeIcon icon={faPlus} /> Add Link
              </button>
            </div>
          </section>
        </form>
      </ModalContent>
      <div className="spacer" />
      <ModalFooter okText="Save" onOk={save} onCancel={cancel}>
        <p>
          Shows & episodes last updated: {longString(settingsStore.lastUpdated)}
          {settingsStore.showOutdatedWarning &&
            <Tooltip className="settings-tooltip tooltip" title="Last update was over 24 hours ago">
              <FontAwesomeIcon className="outdated-warning" icon={faTriangleExclamation} />
            </Tooltip>
          }
        </p>
        <div className="spacer" />
      </ModalFooter>
    </Modal>
  )
})
