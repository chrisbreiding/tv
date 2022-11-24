import cs from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'

import showsStore from './shows-store'
import settingsStore from '../settings/settings-store'
import Show from './show'

export default observer(({ label, type }) => {
  const shows = showsStore[type]

  return (
    <div className={cs('shows', _.kebabCase(type), { 'empty': !shows.length })}>
      <h2>{label}</h2>
      <ul>
        {_.map(shows, (show) => (
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
