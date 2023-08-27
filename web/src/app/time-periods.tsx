import kebabCase from 'lodash/kebabCase'
import { observer } from 'mobx-react'
import React from 'react'
import { Outlet } from 'react-router-dom'

import { Shows } from '../shows/shows'
import { showsStore } from '../shows/shows-store'
import type { ShowModel } from '../shows/show-model'

interface TimePeriodShowsProps {
  label: 'Recent' | 'Upcoming' | 'Off Air'
  shows: ShowModel[]
}

const TimePeriodShows = observer(({ label, shows }: TimePeriodShowsProps) => (
  <div className={`time-period-shows ${kebabCase(label)}`}>
    <h2>{label}</h2>
    <Shows emptyMessage={`No ${label} Shows`} shows={shows} />
  </div>
))

export const TimePeriods = observer(() => (
  <div className="time-periods">
    <TimePeriodShows label="Recent" shows={showsStore.recent} />
    <TimePeriodShows label="Upcoming" shows={showsStore.upcoming} />
    <TimePeriodShows label="Off Air" shows={showsStore.offAir} />
    <Outlet />
  </div>
))
