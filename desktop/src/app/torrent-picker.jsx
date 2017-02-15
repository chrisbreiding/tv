import cs from 'classnames'
import _ from 'lodash'
import React from 'react'
import Tooltip from '@cypress/react-tooltip'

const TorrentPicker = ({ torrents, onSelect }) => (
  <div className='torrent-picker'>
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
  </div>
)

export default TorrentPicker
