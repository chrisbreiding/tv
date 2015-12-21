import axios from 'axios';
import React, { createClass } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { navigateTo } from '../lib/navigation';
import FlashMessage from '../flash-message/flash-message';

const App = createClass({
  componentWillMount () {
    axios.interceptors.response.use(null, (error) => {
      if (error.status === 401) {
        this.props.dispatch(navigateTo('/auth'));
        return;
      }
      return Promise.reject(error);
    });
  },

  render () {
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
});


function stateToProps ({ shows }) {
  return { shows };
}

export default connect(stateToProps)(App);
