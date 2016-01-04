import Immutable from 'immutable';
import { routeReducer } from 'redux-simple-router';
import { recentShows, upcomingShows, offAirShows } from '../shows/util';
import {
  REQUEST_SHOWS,
  RECEIVE_SHOWS,
  ADDING_SHOW,
  SHOW_ADDED,
  SHOW_UPDATED,
  DELETING_SHOW,
  SHOW_DELETED
} from '../shows/actions';
import {
  RECEIVE_SETTINGS,
  SETTINGS_UPDATED
} from '../settings/actions';
import {
  REQUEST_SOURCE_SHOWS,
  RECEIVE_SOURCE_SHOWS
} from '../search/actions';

function withFilteredShows (all) {
  return {
    all,
    recent: recentShows(all),
    upcoming: upcomingShows(all),
    offAir: offAirShows(all),
  };
}

export default {
  routing: routeReducer,

  shows (state = Immutable.Map({
    isFetching: false,
    addingShow: null,
    deletingShow: null,
    all: Immutable.List(),
    recent: Immutable.List(),
    upcoming: Immutable.List(),
    offAir: Immutable.List()
  }), action) {
    switch (action.type) {
      case REQUEST_SHOWS:
        return state.merge({
          isFetching: true
        });
      case RECEIVE_SHOWS:
        return state.merge({
          isFetching: false
        }).merge(
          withFilteredShows(action.shows)
        );
      case ADDING_SHOW:
        return state.merge({
          addingShow: action.showName
        });
      case SHOW_ADDED:
        return state.merge({
          addingShow: null,
        }).merge(
          withFilteredShows(state.get('all').push(action.show))
        );
      case SHOW_UPDATED:
        const indexToUpdate = state.get('all').findIndex((show) => {
          return show.get('id') === action.show.get('id');
        });
        if (indexToUpdate < 0) { return state; }

        return state.merge(withFilteredShows(state.get('all').set(indexToUpdate, action.show)));
      case DELETING_SHOW:
        return state.merge({
          deletingShow: action.showName
        });
      case SHOW_DELETED:
        const indexToDelete = state.get('all').indexOf(action.show);
        if (indexToDelete < 0) { return state; }

        return state.merge({
          deletingShow: null
        }).merge(
          withFilteredShows(state.get('all').delete(indexToDelete))
        );
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
