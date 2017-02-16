import _ from 'lodash'
import Markdown from 'markdown-it'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import Tooltip from '@cypress/react-tooltip'

import FilePicker from './file-picker'
import TorrentPicker from './torrent-picker'
import { states } from './queue-item-model'

import util from '../lib/util'

const statusClass = (state) => _.kebabCase(state.toLowerCase())

const DownloadProgress = ({ info }) => {
  if (!info) return 'Downloading'

  const percentage = Math.round(info.progress * 100)
  return (
    <p className='status download-progress'>
      <span>Downloading: {percentage}% / {util.msToTime(info.timeRemaining)}</span>
      <span className='meter'>
        <span style={{ width: `${percentage}%` }} />
      </span>
    </p>
  )
}

const StatusInfoButton = ({ state, onToggle }) => {
  switch (state) {
    case states.CANCELED:
    case states.FINISHED:
    case states.FAILED:
      return (
        <button onClick={onToggle}>
          <i className='fa fa-info-circle' />
        </button>
      )
    default:
      return null
  }
}

const Status = ({ state, info, onToggleInfo }) => {
  switch (state) {
    case states.DOWNLOADING_TORRENT:
      return <DownloadProgress info={info} />
    default:
      return (
        <p className='status'>
          {_.startCase(state.toLowerCase())}
          <StatusInfoButton state={state} onToggle={onToggleInfo} />
        </p>
      )
  }
}

const ActionButton = observer(({ queueItem, onRemove }) => {
  switch (queueItem.state) {
    case states.CANCELED:
    case states.FINISHED:
    case states.FAILED:
      return (
        <Tooltip title='Remove'>
          <button onClick={onRemove}>
            <i className='fa fa-remove' />
          </button>
        </Tooltip>
      )
    case states.SELECT_TORRENT:
    case states.SELECT_FILE:
      return (
        <Tooltip title='Cancel'>
          <button className='cancel' onClick={queueItem.onCancel}>
            <i className='fa fa-ban' />
          </button>
        </Tooltip>
      )
    default:
      return null
  }
})

const md = new Markdown()

const Info = ({ info, showing }) => {
  if (!info || !showing) return null

  return (
    <div className='info'>
      <h3 dangerouslySetInnerHTML={{ __html: md.render(info.title) }} />
      <div dangerouslySetInnerHTML={{ __html: md.render(info.message || '') }} />
    </div>
  )
}

const Picker = ({ state, items, onSelect }) => {
  if (!items.length) return null

  switch (state) {
    case states.SELECT_TORRENT:
      return (
        <TorrentPicker
          torrents={items}
          onSelect={onSelect}
        />
      )
    case states.SELECT_FILE:
      return (
        <FilePicker
          files={items}
          onSelect={onSelect}
        />
      )
    default:
      return null
  }
}

@observer
class QueueItem extends Component {
  @observable showingInfo = false

  render () {
    const { queueItem, onRemove } = this.props
    const { episode, info } = queueItem
    const epNum = `${episode.season}${util.pad(episode.episode_number)}`
    const showName = episode.show.displayName

    return (
      <li className={`status-${statusClass(queueItem.state)}`}>
        <div className='main'>
          <p className='status-icon'><i className='fa' /></p>
          <p className='ep-num'>{epNum}</p>
          <p className='name'>
            <Tooltip title={showName}>
              <span>{showName}</span>
            </Tooltip>
          </p>
          <Status {...queueItem} onToggleInfo={this._toggleInfo} />
          <p className='action'>
            <ActionButton queueItem={queueItem} onRemove={onRemove} />
          </p>
        </div>
        <Info info={info} showing={this.showingInfo} />
        <Picker {...queueItem} />
      </li>
    )
  }

  @action _toggleInfo = () => {
    this.showingInfo = !this.showingInfo
  }
}

export default QueueItem
