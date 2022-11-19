import { observer } from 'mobx-react'
import React, { Component } from 'react'

import { loadShows } from '../shows/shows-api'
import showsStore from '../shows/shows-store'
import { loadSettings } from '../settings/settings-api'
import settingsStore from '../settings/settings-store'
import Shows from '../shows/shows'
import Loader from '../loader/loader'

class TimePeriods extends Component {
  componentDidMount () {
    loadShows()
    loadSettings()
  }

  render () {
    if (showsStore.isLoadingFromCache || settingsStore.isLoading) {
      return (
        <div className="loading-container full-screen-centered">
          <Loader>Loading shows...</Loader>
        </div>
      )
    } else {
      return (
        <div className="time-periods">
          <Shows
            type="recent"
            label="Recent"
            showsStore={showsStore}
            settings={settingsStore}
          />
          <Shows
            type="upcoming"
            label="Upcoming"
            showsStore={showsStore}
            settings={settingsStore}
          />
          <Shows
            type="offAir"
            label="Off Air"
            showsStore={showsStore}
            settings={settingsStore}
          />
          {this.props.children}
        </div>
      )
    }
  }
}

export default observer(TimePeriods)
