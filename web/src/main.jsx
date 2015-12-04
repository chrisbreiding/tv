import { Provider } from 'react-redux';
import React from 'react';
import { render } from 'react-dom';
import createHistory from 'history/lib/createHashHistory';
import { syncReduxAndRouter } from 'redux-simple-router';
import { Router, IndexRoute, Route, Redirect } from 'react-router';
import store from './data/store';

import App from './app/app';
import Auth from './auth/auth';
import Shows from './shows/shows';

const hashHistory = createHistory();
syncReduxAndRouter(hashHistory, store);


store.subscribe(() => {
  console.log(store.getState());
});


render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Shows} />
        <Route path="/auth" component={Auth} />
        <Redirect from="*" to="/" />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
