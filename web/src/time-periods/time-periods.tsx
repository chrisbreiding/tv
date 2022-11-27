import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { loadShows } from '../shows/shows-api'
import { showsStore } from '../shows/shows-store'
import { loadSettings } from '../settings/settings-api'
import { settingsStore } from '../settings/settings-store'
import { Shows } from '../shows/shows'
import { Loader } from '../loader/loader'

export const TimePeriods = observer(() => {
  useEffect(() => {
    loadShows()
    loadSettings()
  }, [true])

  if (showsStore.isLoadingFromCache || settingsStore.isLoadingFromCache) {
    return (
      <div className="loading-container full-screen-centered">
        <Loader>Loading shows...</Loader>
      </div>
    )
  }

  return (
    <div className="time-periods">
      <Shows type="recent" label="Recent" />
      <Shows type="upcoming" label="Upcoming" />
      <Shows type="offAir" label="Off Air" />
      <Outlet />
    </div>
  )
})
