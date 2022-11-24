import React from 'react'

export default ({ children, theme }) => (
  <span className={`loader theme-${theme || 'dark'}`}>
    <span className="spinner"></span>
    {children}
  </span>
)
