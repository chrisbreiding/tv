import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'

import { App } from './app/app'
import { Auth } from './auth/auth'
import { sendStats } from './data/remote'
import { Results } from './search/results'
import { Search } from './search/search'
import { Settings } from './settings/settings'
import { EditShow } from './show/edit'
import { Show } from './show/show'

dayjs.extend(isBetween)

sendStats('Visit App')

const root = createRoot(document.getElementById('app')!)

root.render(
  <Router>
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<App />}>
        <Route path="shows/:id" element={<Show />} />
        <Route path="shows/:id/edit" element={<EditShow />} />
        <Route path="shows/search" element={<Search />}>
          <Route path=":query" element={<Results />} />
        </Route>
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>,
)
