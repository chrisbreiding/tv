import cs from 'classnames'
import kebabCase from 'lodash/kebabCase'
import { observer } from 'mobx-react'
import React from 'react'

import { showsStore } from './shows-store'
import { settingsStore } from '../settings/settings-store'
import { Show } from './show'

interface ShowsProps {
  label: 'Recent' | 'Upcoming' | 'Off Air'
  type: 'recent' | 'upcoming' | 'offAir'
}

export const Shows = observer(({ label, type }: ShowsProps) => {
  const shows = showsStore[type]

  return (
    <div className={cs('shows', kebabCase(type), { 'empty': !shows.length })}>
      <h2>{label}</h2>
      <ul>
        {shows.map((show) => (
          <Show
            key={show.id}
            show={show}
            type={type}
            searchLinks={settingsStore.searchLinks}
          />
        ))}
      </ul>
      <p className='empty-message'>No {label} Shows</p>
    </div>
  )
})
