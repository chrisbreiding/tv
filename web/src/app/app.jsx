import axios from 'axios';
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';

import Messages from '../messages/messages';
import Loader from '../loader/loader';
import migrate from '../data/migrate';

@withRouter
export default class App extends Component {
  constructor (props) {
    super(props);

    this.state = { ready: false };
  }

  componentWillMount () {
    axios.interceptors.response.use(null, (error) => {
      if (error.status === 401) {
        this.props.router.push('/auth');
        return;
      }
      return Promise.reject(error);
    });

    migrate().then(() => this.setState({ ready: true }));
  }

  render () {
    return this.state.ready ? this._container() : this._loading();
  }

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
        <Messages />
      </div>
    );
  }

  _loading () {
    return (
      <p className="full-screen-centered">
        <Loader>Updating...</Loader>
      </p>
    );
  }
}
