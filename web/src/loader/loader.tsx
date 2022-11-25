import React from 'react'

interface LoaderProps {
  children?: React.ReactNode
  theme?: 'light' | 'dark'
}

export const Loader = ({ children, theme }: LoaderProps) => (
  <span className={`loader theme-${theme || 'dark'}`}>
    <span className="spinner"></span>
    {children}
  </span>
)
