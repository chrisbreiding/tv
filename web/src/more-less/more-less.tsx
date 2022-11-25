import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Children, useState } from 'react'

interface MoreLessProps {
  children: React.ReactNode
  className?: string
  threshold: number
}

export const MoreLess = ({ children, className, threshold }: MoreLessProps) => {
  const [collapsed, setCollapsed] = useState(true)
  const isBeyondThreshold = Children.count(children) > threshold

  const toggle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setCollapsed(!collapsed)

    if (e.target instanceof HTMLElement) {
      e.target.blur()
    }
  }

  return (
    <ul className={className}>
      {isBeyondThreshold && collapsed
        ? Children.toArray(children).slice(0, threshold)
        : children
      }
      {isBeyondThreshold && (
        <li className="more-less">
          <a href="#" onClick={toggle}>
            <FontAwesomeIcon icon={collapsed ? faAngleDown : faAngleUp} />
            {collapsed ? 'more' : 'less'}
          </a>
        </li>
      )}
    </ul>
  )
}
