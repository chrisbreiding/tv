import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'

import App from './app/app'
import Auth from './auth/auth'
import TimePeriods from './time-periods/time-periods'
import Show from './show/show'
import EditShow from './show/edit'
import Settings from './settings/settings'
import Search from './search/search'
import SearchResults from './search/results'
import stats from './lib/stats'

dayjs.extend(isBetween)

stats.send('Visit App')

const root = createRoot(document.getElementById('app'))

root.render(
  <Router>
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<App />}>
        <Route path="shows/:id" element={<Show />} />
        <Route path="shows/:id/edit" element={<EditShow />} />
        <Route path="shows/search" element={<Search />}>
          <Route path=":query" element={<SearchResults />} />
        </Route>
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>,
)
