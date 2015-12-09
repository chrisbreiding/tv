import api from '../data/api';
import { receiveEpisodes, episodesAdded } from '../episodes/actions';

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

export function fetchShows () {
  return (dispatch) => {
    dispatch(requestShows());

    api.getShows().then(({ episodes, shows }) => {
      dispatch(receiveEpisodes(episodes));
      dispatch(receiveShows(shows));
    });
  };
}

export function addShow (showToAdd) {
  return (dispatch) => {
    api.addShow(showToAdd).then(({ show, episodes }) => {
      dispatch(episodesAdded(episodes));
      dispatch(showAdded(show));
    });
  };
}

export function updateShow (show) {
  return (dispatch) => {
    api.updateShow(show).then(() => {
      dispatch(showUpdated(show));
    });
  };
}

export function deleteShow (show) {
  return (dispatch) => {
    api.deleteShow(show).then(() => {
      dispatch(showDeleted(show));
    });
  };
}
