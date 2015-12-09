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

export const RECEIVE_EPISODES = 'RECEIVE_EPISODES';
export function receiveEpisodes (episodes) {
  return {
    type: RECEIVE_EPISODES,
    episodes
  };
}

export const EPISODES_ADDED = 'EPISODES_ADDED';
export function episodesAdded (episodes) {
  return {
    type: EPISODES_ADDED,
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

export const SETTINGS_UPDATED = 'SETTINGS_UPDATED';
export function settingsUpdated (settings) {
  return {
    type: SETTINGS_UPDATED,
    settings
  };
}

export const REQUEST_SOURCE_SHOWS = 'REQUEST_SOURCE_SHOWS';
export function requestSourceShows () {
  return {
    type: REQUEST_SOURCE_SHOWS
  };
}

export const RECEIVE_SOURCE_SHOWS = 'RECEIVE_SOURCE_SHOWS';
export function receiveSourceShows (shows) {
  return {
    type: RECEIVE_SOURCE_SHOWS,
    shows
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

export function fetchSettings () {
  return (dispatch) => {
    api.getSettings().then((settings) => {
      dispatch(receiveSettings(settings));
    });
  };
}

export function updateSettings (settings) {
  return (dispatch) => {
    api.updateSettings(settings).then(() => {
      dispatch(settingsUpdated(settings));
    });
  };
}

export function searchSourceShows (query) {
  return (dispatch) => {
    dispatch(requestSourceShows());

    api.searchSourceShows(query).then((shows) => {
      dispatch(receiveSourceShows(shows));
    });
  };
}
