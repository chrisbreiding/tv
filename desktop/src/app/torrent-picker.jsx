import cs from 'classnames'
import _ from 'lodash'
import React from 'react'
import Tooltip from '@cypress/react-tooltip'

const TorrentPicker = ({ torrents, onCancel, onSubmit }) => (
  <main className='torrent-picker'>
    <h1>Choose a torrent to download</h1>
    <table>
      <thead>
        <tr>
          <th className='verified'>
            <i className='fa fa-thumbs-up' />
          </th>
          <th className='name'>Name</th>
          <th className='seeders'>Seed</th>
          <th className='leechers'>Leech</th>
          <th className='upload-date'>Date</th>
          <th className='uploader'>Uploader</th>
          <th className='size'>Size</th>
        </tr>
      </thead>
      <tbody>
        {_.map(torrents, (torrent) => (
          <tr key={torrent.id} onClick={() => onSubmit(torrent)}>
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
            <td className='upload-date'>
              <Tooltip title={torrent.uploadDate}>
                <span>{(torrent.uploadDate || '').replace(/ ?\d+:\d+(:\d+)?/, '')}</span>
              </Tooltip>
            </td>
            <td className='uploader'>
              <Tooltip title={torrent.uploader}>
                <span>{torrent.uploader}</span>
              </Tooltip>
            </td>
            <td className='size'>
              {(torrent.size || '').toLowerCase().replace(/ ?(\w)ib/, '$1b')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <button onClick={onCancel} className='cancel'>Cancel</button>
  </main>
)

export default TorrentPicker
