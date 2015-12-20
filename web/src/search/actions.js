import api from '../data/api';
import { deserialize } from '../lib/source-shows';

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

export function searchSourceShows (query) {
  return (dispatch) => {
    dispatch(requestSourceShows());

    api.searchSourceShows(query).then((shows) => {
      dispatch(receiveSourceShows(deserialize(shows)));
    });
  };
}
