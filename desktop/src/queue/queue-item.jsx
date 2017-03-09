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
  // show --:-- instead of 00:00 if timeRemaining is 0, but torrent isn't fully downloaded
  const timeRemaining = percentage !== 100 && !info.timeRemaining ? null : info.timeRemaining
  return (
    <p className='status download-progress'>
      <span>Downloading: {percentage}% / {util.msToTime(timeRemaining)}</span>
      <span className='meter'>
        <span style={{ width: `${percentage}%` }} />
      </span>
    </p>
  )
}

const StatusInfoButton = observer(({ queueItem, onToggle }) => {
  if (!queueItem.info || !queueItem.info.title) return null

  switch (queueItem.state) {
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
})

const Status = observer(({ queueItem, onToggleInfo }) => {
  switch (queueItem.state) {
    case states.DOWNLOADING_TORRENT:
      return <DownloadProgress info={queueItem.info} />
    default:
      return (
        <p className='status'>
          {_.startCase(queueItem.state.toLowerCase())}
          <StatusInfoButton queueItem={queueItem} onToggle={onToggleInfo} />
        </p>
      )
  }
})

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
    case states.SEARCHING_TORRENTS:
    case states.DOWNLOADING_TORRENT:
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

const Info = ({ queueItem, showing }) => {
  const { info } = queueItem
  if (!info || !info.title || !showing) return null

  return (
    <div className='info'>
      <h3 dangerouslySetInnerHTML={{ __html: md.render(info.title) }} />
      <div dangerouslySetInnerHTML={{ __html: md.render(info.message || '') }} />
    </div>
  )
}

const Picker = observer(({ queueItem }) => {
  const { state, items, onSelect } = queueItem
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
})

@observer
class QueueItem extends Component {
  @observable showingInfo = false

  render () {
    const { queueItem, onRemove } = this.props
    const { episode } = queueItem
    const epNum = `${episode.season}${util.pad(episode.number)}`
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
          <Status queueItem={queueItem} onToggleInfo={this._toggleInfo} />
          <p className='action'>
            <ActionButton queueItem={queueItem} onRemove={onRemove} />
          </p>
        </div>
        <Info queueItem={queueItem} showing={this.showingInfo} />
        <Picker queueItem={queueItem} />
      </li>
    )
  }

  @action _toggleInfo = () => {
    this.showingInfo = !this.showingInfo
  }
}

export default QueueItem
