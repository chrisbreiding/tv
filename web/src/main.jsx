import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useStrict } from 'mobx'
import React from 'react'
import { render } from 'react-dom'
import { createHistory } from 'history'
import { IndexRoute, Router, Route, Redirect, useRouterHistory } from 'react-router'

useStrict(true)

import App from './app/app'
import Auth from './auth/auth'
import TimePeriods from './time-periods/time-periods'
import Show from './show/show'
import EditShow from './show/edit'
import Settings from './settings/settings'
import Search from './search/search'
import SearchResults from './search/results'

dayjs.extend(isBetween)

const history = useRouterHistory(createHistory)()

render(
  <Router history={history}>
    <Redirect from="/" to="/shows" />
    <Route path="/" component={App}>
      <Route path="/shows" component={TimePeriods}>
        <Route path=":id" component={Show} />
        <Route path=":id/edit" component={EditShow} />
        <Route path="/settings" component={Settings} />
        <Route path="/search" component={Search}>
          <IndexRoute component={SearchResults} />
          <Route path=":query" component={SearchResults} />
        </Route>
      </Route>
      <Route path="/auth" component={Auth} />
      <Redirect from="/*" to="/shows" />
    </Route>
  </Router>,
  document.getElementById('app'),
)
