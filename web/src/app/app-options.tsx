import { faSliders, faPlus, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router-dom'

import { settingsStore } from '../settings/settings-store'

export const AppOptions = observer(() => (
  <ul className="app-options">
    <li>
      <Link to="/shows/search" title="Add Show">
        <FontAwesomeIcon icon={faPlus} />
      </Link>
    </li>
    <li>
      <Link to="/settings" title="Settings">
        <FontAwesomeIcon icon={faSliders} />
        {settingsStore.showOutdatedWarning &&
          <FontAwesomeIcon className="outdated-warning" icon={faTriangleExclamation} />
        }
      </Link>
    </li>
  </ul>
))
