import React from 'react'

const Loader = ({ children, message }) => (
  <main className='loading'>
    <p>
      <span><i className='fa fa-soccer-ball-o fa-spin'></i></span>
      {message}...
    </p>
    {children}
  </main>
)

export default Loader
