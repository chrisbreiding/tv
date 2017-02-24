import React from 'react'

export default (props) => {
  return (
    <span className="loader">
      <i className="fa fa-spin fa-soccer-ball-o"></i>
      {props.children}
    </span>
  )
}
