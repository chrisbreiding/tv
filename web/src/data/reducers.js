import _ from 'lodash';
import Immutable from 'immutable';
import { routeReducer } from 'redux-simple-router';
import {
  REQUEST_SHOWS,
  RECEIVE_SHOWS,
  SHOW_DELETED,
  SHOW_UPDATED,
  RECEIVE_EPISODES,
  RECEIVE_SETTINGS,
  SETTINGS_UPDATED
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
      case SHOW_UPDATED:
        const indexToUpdate = state.items.findIndex((show) => {
          return show.get('id') === action.show.get('id');
        });
        if (indexToUpdate < 0) { return state; }

        return _.extend({}, state, {
          items: state.items.set(indexToUpdate, action.show)
        });
      case SHOW_DELETED:
        const indexToDelete = state.items.indexOf(action.show);
        if (indexToDelete < 0) { return state; }

        return _.extend({}, state, {
          items: state.items.delete(indexToDelete)
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
      case SETTINGS_UPDATED:
        return state.merge(action.settings);
      default:
        return state;
    }
  },
};
