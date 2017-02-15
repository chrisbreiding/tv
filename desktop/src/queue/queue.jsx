import _ from 'lodash'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import Tooltip from '@cypress/react-tooltip'

import FilePicker from './file-picker'
import TorrentPicker from './torrent-picker'

import state from '../lib/state'
import util from '../lib/util'

const DOWNLOADING_TORRENT = 'DOWNLOADING_TORRENT'
const FINISHED = 'FINISHED'
const CANCELED = 'CANCELED'
const ERROR = 'ERROR'

const statusClass = (state) => _.kebabCase(state.toLowerCase())

const downloadProgress = (info) => {
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

const showInfo = (title, message, type) => action('show:queue:error', () => {
  state.addNotification({ title, message, type })
})

const displayCanceled = ({ title }) => (
  <p className='status'>
    Canceled
    <button onClick={showInfo(title, null, 'info')}>
      <i className='fa fa-info-circle' />
    </button>
  </p>
)

const displayFinished = ({ title, message }) => (
  <p className='status'>
    Finished
    <button onClick={showInfo(title, message, 'success')}>
      <i className='fa fa-info-circle' />
    </button>
  </p>
)

const displayError = ({ message, details } = {}) => (
  <p className='status'>
    Error
    <button onClick={showInfo(message, details, 'error')}>
      <i className='fa fa-info-circle' />
    </button>
  </p>
)

const status = ({ error, info, state }) => {
  switch (state) {
    case DOWNLOADING_TORRENT:
      return downloadProgress(info)
    case CANCELED:
      return displayCanceled(info)
    case FINISHED:
      return displayFinished(info)
    case ERROR:
      return displayError(error)
    default:
      return (
        <p className='status'>
          {_.startCase(state.toLowerCase())}
        </p>
      )
  }
}

const remove = (queueItem) => () => {
  state.removeQueueItem(queueItem)
}

const actionButton = (queueItem) => {
  switch (queueItem.state) {
    case CANCELED:
    case FINISHED:
    case ERROR:
      return (
        <Tooltip title='Remove'>
          <button onClick={remove(queueItem)}>
            <i className='fa fa-remove' />
          </button>
        </Tooltip>
      )
    default:
      return (
        <Tooltip title='Cancel'>
          <button className='cancel' onClick={() => {}}>
            <i className='fa fa-ban' />
          </button>
        </Tooltip>
      )
  }
}

const torrentPicker = (queueItem) => {
  if (!queueItem.torrents.length) return null

  return (
    <TorrentPicker
      torrents={queueItem.torrents}
      onSelect={queueItem.onSelect}
    />
  )
}

const filePicker = (queueItem) => {
  if (!queueItem.files.length) return null

  return (
    <FilePicker
      files={queueItem.files}
      onSelect={queueItem.onSelect}
    />
  )
}

const QueueItem = observer(({ queueItem }) => {
  const { episode } = queueItem
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
        {status(queueItem)}
        <p className='action'>{actionButton(queueItem)}</p>
      </div>
      {torrentPicker(queueItem)}
      {filePicker(queueItem)}
    </li>
  )
})

const Queue = observer(() => (
  <main className='queue'>
    <h1>Queue</h1>
    <ul>
      {_.map(state.queue.values(), (queueItem) => (
        <QueueItem key={queueItem.id} queueItem={queueItem} />
      ))}
    </ul>
  </main>
))

export default Queue
