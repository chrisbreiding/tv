import React from 'react'

const Loader = ({ children, theme }) => (
  <span className={`loader theme-${theme || 'dark'}`}>
    <span className="spinner"></span>
    {children}
  </span>
)

export default Loader
