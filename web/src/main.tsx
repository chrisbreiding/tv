import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'

import { App } from './app/app'
import { Auth } from './auth/auth'
import { Calendar } from './calendar/calendar'
import { Date } from './calendar/date'
import { sendStats } from './data/remote'
import { Results } from './search/results'
import { Search } from './search/search'
import { Settings } from './settings/settings'
import { settingsStore } from './settings/settings-store'
import { EditShow } from './show/edit'
import { Show } from './show/show'
import { TimePeriods } from './app/time-periods'
import { observer } from 'mobx-react'

dayjs.extend(isBetween)

sendStats('Visit App')

const root = createRoot(document.getElementById('app')!)

const Root = observer(() => (
  <Router>
    <Routes>
      <Route path='/auth' element={<Auth />} />
      <Route path='/' element={<App />}>
        <Route path='list' element={<TimePeriods />}>
          <Route path='shows/:id' element={<Show />} />
          <Route path='shows/:id/edit' element={<EditShow />} />
          <Route path='shows/search' element={<Search />}>
            <Route path=':query' element={<Results />} />
          </Route>
        </Route>
        <Route path='calendar' element={<Calendar />}>
          <Route path='shows/search' element={<Search />}>
            <Route path=':query' element={<Results />} />
          </Route>
          <Route path=':date' element={<Date />}>
            <Route path='shows/:id' element={<Show />} />
            <Route path='shows/:id/edit' element={<EditShow />} />
          </Route>
        </Route>
        <Route path='settings' element={<Settings />} />
        <Route path='/' element={<Navigate to={`/${settingsStore.preferredView}`} replace />} />
      </Route>
      <Route path='*' element={<Navigate to={`/${settingsStore.preferredView}`} replace />} />
    </Routes>
  </Router>
))

root.render(<Root />)
