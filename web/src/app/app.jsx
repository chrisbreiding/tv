import axios from 'axios';
import { createClass } from 'react';
import { connect } from 'react-redux';
import { updatePath } from 'redux-simple-router';

const App = createClass({
  componentWillMount () {
    axios.interceptors.response.use(null, (error) => {
      if (error.status === 401) {
        this.props.dispatch(updatePath('/auth'));
        return;
      }
      return Promise.reject(error);
    });
  },

  render () {
    return this.props.children;
  },
});

export default connect()(App);
