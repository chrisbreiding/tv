import _ from 'lodash';
import Immutable from 'immutable';
import { routeReducer } from 'redux-simple-router';
import {
  REQUEST_SHOWS,
  RECEIVE_SHOWS,
  SHOW_ADDED,
  SHOW_UPDATED,
  SHOW_DELETED
} from '../shows/actions';
import {
  RECEIVE_EPISODES,
  EPISODES_ADDED
} from '../episodes/actions';
import {
  RECEIVE_SETTINGS,
  SETTINGS_UPDATED
} from '../settings/actions';
import {
  REQUEST_SOURCE_SHOWS,
  RECEIVE_SOURCE_SHOWS
} from '../search/actions';

export default {
  routing: routeReducer,

  shows (state = Immutable.Map({
    isFetching: false,
    items: Immutable.List()
  }), action) {
    switch (action.type) {
      case REQUEST_SHOWS:
        return state.merge({
          isFetching: true
        });
      case RECEIVE_SHOWS:
        return state.merge({
          isFetching: false,
          items: action.shows
        });
      case SHOW_ADDED:
        return state.merge({
          items: state.get('items').push(action.show)
        });
      case SHOW_UPDATED:
        const indexToUpdate = state.get('items').findIndex((show) => {
          return show.get('id') === action.show.get('id');
        });
        if (indexToUpdate < 0) { return state; }

        return state.merge({
          items: state.get('items').set(indexToUpdate, action.show)
        });
      case SHOW_DELETED:
        const indexToDelete = state.get('items').indexOf(action.show);
        if (indexToDelete < 0) { return state; }

        return state.merge({
          items: state.get('items').delete(indexToDelete)
        });
      default:
        return state;
    }
  },

  episodes (state = Immutable.Map(), action) {
    switch (action.type) {
      case RECEIVE_EPISODES:
        return action.episodes;
      case EPISODES_ADDED:
        return state.merge(action.episodes);
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

  sourceShows (state = Immutable.Map({
    isFetching: false,
    items: Immutable.List()
  }), action) {
    switch (action.type) {
      case REQUEST_SOURCE_SHOWS:
        return state.merge({
          isFetching: true
        });
      case RECEIVE_SOURCE_SHOWS:
        return state.merge({
          isFetching: false,
          items: action.shows
        });
      default:
        return state;
    }
  },
};
