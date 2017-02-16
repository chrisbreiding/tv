import _ from 'lodash'
import React from 'react'

const FilePicker = ({ files, onSelect }) => (
  <div className='file-picker'>
    <ul>
      {_.map(files, (file) => (
        <li key={file.path} onClick={() => onSelect(file)}>
          <i className='fa fa-file-movie-o' />
          {file.relativePath}
        </li>
      ))}
    </ul>
  </div>
)

export default FilePicker
