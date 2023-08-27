import { faCalendarAlt, faList, faPlus, faSliders, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import React from 'react'
import { Link, NavLink, useMatch } from 'react-router-dom'

import { settingsStore } from '../settings/settings-store'

export const Header = observer(() => {
  const matchesList = !!useMatch('/list')
  const matchesCalendar = !!useMatch('/calendar')
  const root = matchesList ? '/list' : '/calendar'

  return (
    <header className='app-header'>
      <ul>
        <li className='nav-list'>
          <NavLink
            to="/list"
            title="List View"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <FontAwesomeIcon icon={faList} />
          </NavLink>
        </li>
        <li className='nav-calendar'>
          <NavLink
            to="/calendar"
            title="Calendar View"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <FontAwesomeIcon icon={faCalendarAlt} />
          </NavLink>
        </li>
        <li className='nav-settings'>
          <NavLink
            to="/settings"
            title="Settings"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <FontAwesomeIcon icon={faSliders} />
            {settingsStore.showOutdatedWarning &&
              <FontAwesomeIcon className="outdated-warning" icon={faTriangleExclamation} />
            }
          </NavLink>
        </li>
        <li className='spacer' />
        {(matchesList || matchesCalendar) && (
          <li>
            <Link to={`${root}/shows/search`} title="Add Show">
              <FontAwesomeIcon icon={faPlus} />
            </Link>
          </li>
        )}
      </ul>
    </header>
  )
})
