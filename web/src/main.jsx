import { Provider } from 'react-redux';
import React from 'react';
import { render } from 'react-dom';
import createHistory from 'history/lib/createHashHistory';
import { syncReduxAndRouter } from 'redux-simple-router';
import { Router, Route, Redirect } from 'react-router';
import store from './data/store';

import App from './app/app';
import Auth from './auth/auth';
import TimePeriods from './time-periods/time-periods';
import Show from './show/show';

const hashHistory = createHistory();
syncReduxAndRouter(hashHistory, store);


store.subscribe(() => {
  console.log(store.getState());
});


render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <Route path="/shows" component={TimePeriods}>
          <Route path=":id" component={Show} />
        </Route>
        <Route path="/auth" component={Auth} />
        <Redirect from="/" to="/shows" />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
