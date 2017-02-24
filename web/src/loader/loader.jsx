import React from 'react'

export default (props) => {
  return (
    <span className="loader">
      <span className="spinner"></span>
      {props.children}
    </span>
  )
}
