import { observer } from 'mobx-react'
import React from 'react'
import Tooltip from '@cypress/react-tooltip'

import { Episodes } from '../episodes/episodes'
import { ShowOptions } from './show-options'
import type { ShowModel } from './show-model'
import type { SearchLink } from '../lib/types'

export interface ShowProps {
  show: ShowModel
  searchLinks: SearchLink[]
}

export const Show = observer(({ show, searchLinks }: ShowProps) => (
  <li key={show.id}>
    <h3>
      <Tooltip className="show-tooltip options-tooltip tooltip" placement="right" title={(
        <ShowOptions id={show.id} searchName={show.searchName} searchLinks={searchLinks} />
      )}>
        <span>{show.displayName}</span>
      </Tooltip>
    </h3>
    <Episodes show={show} episodes={show.episodes} threshold={3} />
  </li>
))
