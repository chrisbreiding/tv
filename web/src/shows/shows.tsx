import cs from 'classnames'
import { observer } from 'mobx-react'
import React from 'react'

import { settingsStore } from '../settings/settings-store'
import { Show } from './show'
import type { ShowModel } from './show-model'

interface ShowsProps {
  emptyMessage: string
  shows: ShowModel[]
}

export const Shows = observer(({ emptyMessage, shows }: ShowsProps) => (
  <div className={cs('shows', { 'empty': !shows.length })}>
    <ul>
      {shows.map((show) => (
        <Show
          key={show.id}
          show={show}
          searchLinks={settingsStore.searchLinks}
        />
      ))}
    </ul>
    <p className='empty-message'>{emptyMessage}</p>
  </div>
))
