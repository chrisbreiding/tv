import { observer } from 'mobx-react'
import React from 'react'
import Tooltip from '@cypress/react-tooltip'

import Episodes from '../episodes/episodes'
import Options from './show-options'

export default observer(({ show, type, searchLinks }) => (
  <li key={show.id}>
    <h3>
      <Tooltip className="show-tooltip options-tooltip tooltip" placement="right" title={(
        <Options id={show.id} searchName={show.searchName} searchLinks={searchLinks} />
      )}>
        <span>{show.displayName}</span>
      </Tooltip>
    </h3>
    <Episodes show={show} episodes={show[`${type}Episodes`]} threshold={3} />
  </li>
))
