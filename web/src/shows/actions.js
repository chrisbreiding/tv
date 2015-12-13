import Immutable from 'immutable';
import api from '../data/api';
import cache, { SHOWS, EPISODES } from '../data/cache';
import { receiveEpisodes, episodesAdded } from '../episodes/actions';
import { index } from '../lib/episodes';

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

export const SHOW_DELETED = 'SHOW_DELETED';
export function showDeleted (show) {
  return {
    type: SHOW_DELETED,
    show
  };
}

function getShowsFromCache () {
  return Promise.all([
    cache.get(EPISODES),
    cache.get(SHOWS)
  ]);
}

function getShowsFromApi () {
  return api.getShows().then(({ episodes, shows }) => {
    episodes = index(episodes);
    cache.set(EPISODES, episodes);
    cache.set(SHOWS, shows);
    return { episodes: index(episodes), shows };
  });
}

export function fetchShows () {
  return (dispatch) => {
    dispatch(requestShows());

    getShowsFromCache().then(([episodes, shows]) => {
      return episodes && shows ? { episodes, shows } : getShowsFromApi();
    }).then(({ episodes, shows }) => {
      dispatch(receiveEpisodes(episodes));
      dispatch(receiveShows(shows));
    });
  };
}

export function addShow (showToAdd) {
  return (dispatch, getState) => {
    api.addShow(showToAdd).then(({ show, episodes }) => {
      dispatch(episodesAdded(episodes));
      dispatch(showAdded(show));

      const state = getState();
      cache.set(EPISODES, state.episodes);
      cache.set(SHOWS, state.shows.get('items'));
    });
  };
}

export function updateShow (show) {
  return (dispatch) => {
    api.updateShow(show).then(() => {
      dispatch(showUpdated(show));

      cache.set(SHOWS, getState().shows.get('items'));
    });
  };
}

export function deleteShow (show) {
  return (dispatch) => {
    api.deleteShow(show).then(() => {
      dispatch(showDeleted(show));

      cache.set(SHOWS, getState().shows.get('items'));
    });
  };
}
