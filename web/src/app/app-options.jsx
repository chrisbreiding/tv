import { faSliders, faPlus, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router'

import settingsStore from '../settings/settings-store'

const AppOptions = () => (
  <ul className="app-options">
    <li>
      <Link to="/search" title="Add Show">
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
)

export default observer(AppOptions)
