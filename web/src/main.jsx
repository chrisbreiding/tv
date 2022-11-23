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

dayjs.extend(isBetween)

const root = createRoot(document.getElementById('app'))

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/shows" replace />} />
      <Route path="/" element={<App />}>
        <Route path="shows" element={<TimePeriods />}>
          <Route path=":id" element={<Show />} />
          <Route path=":id/edit" element={<EditShow />} />
          <Route path="settings" element={<Settings />} />
          <Route path="search" element={<Search />}>
            <Route path=":query" element={<SearchResults />} />
          </Route>
        </Route>
        <Route path="auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/shows" replace />} />
      </Route>
    </Routes>
  </Router>,
)
