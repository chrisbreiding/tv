import api from './api';

export const REQUEST_SHOWS = 'REQUEST_SHOWS';
export function requestShows () {
  return {
    type: REQUEST_SHOWS
  };
}

export const RECEIVE_SHOWS = 'RECEIVE_SHOWS';
export function receiveShows (data) {
  return {
    type: RECEIVE_SHOWS,
    data
  };
}

export function fetchShows () {
  return (dispatch) => {
    dispatch(requestShows());

    api.getShows().then((data) => {
      if (!data) { return; }

      dispatch(receiveShows(data));
    });

  };
}
