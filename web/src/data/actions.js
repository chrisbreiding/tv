import api from './api';

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

export const RECEIVE_EPISODES = 'RECEIVE_EPISODES';
export function receiveEpisodes (episodes) {
  return {
    type: RECEIVE_EPISODES,
    episodes
  };
}

export const RECEIVE_SETTINGS = 'RECEIVE_SETTINGS';
export function receiveSettings (settings) {
  return {
    type: RECEIVE_SETTINGS,
    settings
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

export function fetchSettings () {
  return (dispatch) => {
    api.getSettings().then((settings) => {
      dispatch(receiveSettings(settings));
    });
  };
}
