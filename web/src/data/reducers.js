import _ from 'lodash';
import { routeReducer } from 'redux-simple-router';
import {
  REQUEST_SHOWS,
  RECEIVE_SHOWS
} from './actions';

export default {
  routing: routeReducer,

  shows (state = {
    isFetching: false,
    items: []
  }, action) {
    switch (action.type) {
      case REQUEST_SHOWS:
        return _.extend({}, state, {
          isFetching: true
        });
      case RECEIVE_SHOWS:
        return _.extend({}, state, {
          isFetching: false,
          items: action.data.shows
        });
      default:
        return state;
    }
  }
};
