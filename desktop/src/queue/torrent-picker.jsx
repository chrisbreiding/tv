import cs from 'classnames'
import _ from 'lodash'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import Tooltip from '@cypress/react-tooltip'

const isMagnetLink = (text) => /^magnet:/.test(text)

@observer
class MagnetLinkInput extends Component {
  @observable isDraggingOver

  componentDidMount () {
    // silly idiosyncrancies of the drag-n-drop API
    document.addEventListener('dragover', this._nope)
    document.addEventListener('drop', this._nope)
  }

  render () {
    return (
      <input
        className={cs('magnet-link-input', { 'is-dragging-over': this.isDraggingOver })}
        onDragOver={this._dragover}
        onDragLeave={this._dragleave}
        onDrop={this._drop}
        placeholder="Choose torrent - or - Drag magnet link here - or - Paste magnet link and hit Enter"
        onKeyUp={this._onKeyUp}
      />
    )
  }

  _dragover = () => {
    this._setDragging(true)
    return false
  }

  _dragleave = () => {
    this._setDragging(false)
    return false
  }

  _drop = (e) => {
    e.preventDefault()
    this._setDragging(false)

    e.dataTransfer.items[0].getAsString((text) => {
      if (isMagnetLink(text)) {
        this.props.onInput({ magnetLink: text })
      }
    })

    return false
  }

  _onKeyUp = (e) => {
    if (e.key === 'Enter' && isMagnetLink(e.target.value)) {
      this.props.onInput({ magnetLink: e.target.value })
      e.target.value = ''
    }
  }

  @action _setDragging = (isDraggingOver) => {
    this.isDraggingOver = isDraggingOver
  }

  _nope (e) {
    e.preventDefault()
    return false
  }

  componentWillUnmount () {
    document.removeEventListener('dragover', this._nope)
    document.removeEventListener('drop', this._nope)
  }
}

const Torrents = ({ torrents, onSelect }) => {
  if (!torrents.length) return <p className='empty'>No torrents found</p>

  return (
    <table>
      <thead>
        <tr>
          <th className='verified'>
            <i className='fa fa-thumbs-up' />
          </th>
          <th className='name'>Name</th>
          <th className='seeders'>Seed</th>
          <th className='leechers'>Leech</th>
          <th className='size'>Size</th>
          <th className='uploader'>Uploader</th>
          <th className='upload-date'>Date</th>
        </tr>
      </thead>
      <tbody>
        {_.map(torrents, (torrent) => (
          <tr key={torrent.id} onClick={() => onSelect(torrent)}>
            <td className='verified'>
              <Tooltip title={torrent.verified ? 'Verified Uploader' : ''}>
                <i className={cs('fa', { 'fa-check': torrent.verified })} />
              </Tooltip>
            </td>
            <td className='name'>
              <Tooltip title={torrent.name}>
                <span>{torrent.name}</span>
              </Tooltip>
            </td>
            <td className='seeders'>{torrent.seeders}</td>
            <td className='leechers'>{torrent.leechers}</td>
            <td className='size'>
              {(torrent.size || '').toLowerCase().replace(/ ?(\w)ib/, '$1b')}
            </td>
            <td className='uploader'>{torrent.uploader}</td>
            <td className='upload-date'>
              <Tooltip title={torrent.uploadDate}>
                <span>{(torrent.uploadDate || '').replace(/ ?\d+:\d+(:\d+)?/, '')}</span>
              </Tooltip>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const TorrentPicker = ({ torrents, onSelect }) => (
  <div className='torrent-picker'>
    <MagnetLinkInput onInput={onSelect} />
    <Torrents torrents={torrents} onSelect={onSelect} />
  </div>
)

export default TorrentPicker
