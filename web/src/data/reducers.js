import _ from 'lodash';
import Immutable from 'immutable';
import { routeReducer } from 'redux-simple-router';
import {
  REQUEST_SHOWS,
  RECEIVE_SHOWS,
  RECEIVE_EPISODES,
  RECEIVE_SETTINGS
} from './actions';

export default {
  routing: routeReducer,

  shows (state = {
    isFetching: false,
    items: Immutable.List()
  }, action) {
    switch (action.type) {
      case REQUEST_SHOWS:
        return _.extend({}, state, {
          isFetching: true
        });
      case RECEIVE_SHOWS:
        return _.extend({}, state, {
          isFetching: false,
          items: action.shows
        });
      default:
        return state;
    }
  },

  episodes (state = Immutable.Map(), action) {
    switch (action.type) {
      case RECEIVE_EPISODES:
        return action.episodes;
      default:
        return state;
    }
  },

  settings (state = Immutable.Map(), action) {
    switch (action.type) {
      case RECEIVE_SETTINGS:
        return action.settings;
      default:
        return state;
    }
  },
};
