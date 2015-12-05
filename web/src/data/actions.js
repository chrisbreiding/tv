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

export function fetchShows () {
  return (dispatch) => {
    dispatch(requestShows());

    api.getShows().then((data) => {
      dispatch(receiveEpisodes(data.episodes));
      dispatch(receiveShows(data.shows));
    });
  };
}
