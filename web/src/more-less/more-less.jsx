import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Children, useState } from 'react'

const MoreLess = ({ children, className, threshold }) => {
  const [collapsed, setCollapsed] = useState(true)
  const isBeyondThreshold = threshold && Children.count(children) > threshold

  const button = () => {
    if (!isBeyondThreshold) { return null }

    return (
      <li className="more-less">
        <a href="#" onClick={toggle}>
          <FontAwesomeIcon icon={collapsed ? faAngleDown : faAngleUp} />
          {collapsed ? 'more' : 'less'}
        </a>
      </li>
    )
  }

  const toggle = (e) => {
    e.preventDefault()
    setCollapsed(!collapsed)
    e.target.blur()
  }

  return (
    <ul className={className}>
      {isBeyondThreshold && collapsed
        ? Children.toArray(children).slice(0, threshold)
        : children
      }
      {button(isBeyondThreshold)}
    </ul>
  )
}

export default MoreLess
