import _ from 'lodash'
import React from 'react'

const Files = ({ files, onSelect }) => {
  if (!files.length) return <p className='empty'>No files found</p>

  return (
    <ul>
      {_.map(files, (file) => (
        <li key={file.path} onClick={() => onSelect(file)}>
          <i className='fa fa-file-movie-o' />
          {file.relativePath}
        </li>
      ))}
    </ul>
  )
}

const FilePicker = ({ files, onSelect }) => (
  <div className='file-picker'>
    <Files files={files} onSelect={onSelect} />
  </div>
)

export default FilePicker
