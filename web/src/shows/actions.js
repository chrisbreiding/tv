import api from '../data/api';
import Immutable from 'immutable';
import moment from 'moment';
import cache, { SHOWS, EPISODES, DATE_SHOWS_UPDATED } from '../data/cache';
import { receiveEpisodes, episodesAdded } from '../episodes/actions';
import { deserializeShows, serializeShows, deserializeShow, serializeShow } from '../shows/util';
import { deserializeEpisodes, serializeEpisodes, index } from '../episodes/util';
import date from '../lib/date';

export const REQUEST_SHOWS = 'REQUEST_SHOWS';
export function requestShows () {
  return {
    type: REQUEST_SHOWS
  };
}

export const RECEIVE_SHOWS = 'RECEIVE_SHOWS';
export function receiveShows (shows) {
  return {
    type: RECEIVE_SHOWS,
    shows
  };
}

export const ADDING_SHOW = 'ADDING_SHOW';
export function addingShow (showName) {
  return {
    type: ADDING_SHOW,
    showName
  };
}

export const SHOW_ADDED = 'SHOW_ADDED';
export function showAdded (show) {
  return {
    type: SHOW_ADDED,
    show
  };
}

export const SHOW_UPDATED = 'SHOW_UPDATED';
export function showUpdated (show) {
  return {
    type: SHOW_UPDATED,
    show
  };
}

export const DELETING_SHOW = 'DELETING_SHOW';
export function deletingShow (showName) {
  return {
    type: DELETING_SHOW,
    showName
  };
}

export const SHOW_DELETED = 'SHOW_DELETED';
export function showDeleted (show) {
  return {
    type: SHOW_DELETED,
    show
  };
}

function getShowsFromCache () {
  return Promise.all([
    cache.get(EPISODES).then(episodes => episodes && deserializeEpisodes(episodes)),
    cache.get(SHOWS).then(shows => shows && deserializeShows(shows)),
    cache.get(DATE_SHOWS_UPDATED).then(date => date && moment(date.date))
  ]);
}

function getShowsFromApi () {
  return api.getShows().then(({ episodes, shows }) => {
    const indexedEpisodes = index(episodes);
    const deserializedEpisodes = deserializeEpisodes(indexedEpisodes);
    const deserializedShows = deserializeShows(shows);
    cache.set(EPISODES, indexedEpisodes);
    cache.set(SHOWS, shows);
    cache.set(DATE_SHOWS_UPDATED, date.todayObject());
    return {
      episodes: deserializedEpisodes,
      shows: deserializedShows
    };
  });
}

function evaluateCache ([episodes, shows, dateUpdated]) {
  return episodes && shows && dateUpdated && date.isToday(dateUpdated) ?
    { episodes, shows } :
    getShowsFromApi();
}

export function fetchShows () {
  return (dispatch) => {
    dispatch(requestShows());

    getShowsFromCache()
      .then(evaluateCache)
      .then(({ episodes, shows }) => {
        dispatch(receiveEpisodes(episodes));
        dispatch(receiveShows(shows));
      });
  };
}

export function addShow (showToAdd) {
  return (dispatch, getState) => {
    dispatch(addingShow(showToAdd.display_name));

    api.addShow(showToAdd).then(({ show, episodes }) => {
      dispatch(episodesAdded(deserializeEpisodes(index(episodes))));
      dispatch(showAdded(deserializeShow(show)));

      const state = getState();
      cache.set(EPISODES, serializeEpisodes(state.episodes));
      cache.set(SHOWS, serializeShows(state.shows.get('items')));
    });
  };
}

export function updateShow (show) {
  return (dispatch, getState) => {
    api.updateShow(serializeShow(show)).then(() => {
      dispatch(showUpdated(deserializeShow(show)));

      cache.set(SHOWS, serializeShows(getState().shows.get('items')));
    });
  };
}

export function deleteShow (show) {
  return (dispatch, getState) => {
    dispatch(deletingShow(show.get('display_name')));

    api.deleteShow(serializeShow(show)).then(() => {
      dispatch(showDeleted(deserializeShow(show)));

      cache.set(SHOWS, serializeShows(getState().shows.get('items')));
    });
  };
}
