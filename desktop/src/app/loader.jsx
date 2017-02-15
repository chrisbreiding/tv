import React from 'react'

const Loader = ({ message }) => (
  <main className='loading'>
    <p>
      <span><i className='fa fa-soccer-ball-o fa-spin'></i></span>
      {message}...
    </p>
  </main>
)

export default Loader
