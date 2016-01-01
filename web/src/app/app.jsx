import axios from 'axios';
import React, { createClass } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { navigateTo } from '../lib/navigation';
import { pluckState } from '../data/util';
import FlashMessage from '../flash-message/flash-message';
import Loader from '../loader/loader';
import migrate from '../data/migrate';

const App = createClass({
  getInitialState () {
    return { ready: false };
  },

  componentWillMount () {
    axios.interceptors.response.use(null, (error) => {
      if (error.status === 401) {
        this.props.dispatch(navigateTo('/auth'));
        return;
      }
      return Promise.reject(error);
    });

    migrate().then(() => this.setState({ ready: true }));
  },

  render () {
    return this.state.ready ? this._container() : this._loading();
  },

  _container () {
    return (
      <div>
        <ul className="app-options">
          <li>
            <Link to="/search" title="Add Show">
              <i className="fa fa-plus"></i>
            </Link>
          </li>
          <li>
            <Link to="/settings" title="Settings">
              <i className="fa fa-cog"></i>
            </Link>
          </li>
        </ul>
        {this.props.children}
        <FlashMessage {...this.props} />
      </div>
    );
  },

  _loading () {
    return (
      <p className="full-screen-centered">
        <Loader>Updating...</Loader>
      </p>
    );
  },
});

export default connect(pluckState('shows'))(App);
