import api from '../data/api';
import Immutable from 'immutable';
import moment from 'moment';
import partial from 'lodash.partial';
import cache, { SHOWS, DATE_SHOWS_UPDATED } from '../data/cache';
import * as showsUtil from '../shows/util';
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
  return cache.get(SHOWS).then(shows => shows && showsUtil.deserializeShowsAndEpisodes(shows));
}

function getShowsFromApi () {
  return api.getShows().then(({ shows, episodes }) => {
    const deserializedShows = showsUtil.deserializeShows(shows);
    const deserializedEpisodes = deserializeEpisodes(index(episodes));
    const showsWithEpisodes = showsUtil.showsWithEpisodes(deserializedShows, deserializedEpisodes);
    cache.set(SHOWS, showsUtil.serializeShows(showsWithEpisodes));
    return showsWithEpisodes;
  });
}

function evaluateCache (shows) {
  return shows || getShowsFromApi();
}

function dispatchShows (dispatch, shows) {
  dispatch(receiveShows(shows));
}

export function fetchShows () {
  return (dispatch) => {
    dispatch(requestShows());

    const send = partial(dispatchShows, dispatch);

    getShowsFromCache()
      .then(evaluateCache)
      .then(send)
      .then(() => cache.get(DATE_SHOWS_UPDATED))
      .then((dateUpdated) => {
         if (dateUpdated && !date.isToday(moment(dateUpdated.date))) {
           getShowsFromApi().then(send);
         }
         cache.set(DATE_SHOWS_UPDATED, date.todayObject());
      });
  };
}

export function addShow (showToAdd) {
  return (dispatch, getState) => {
    dispatch(addingShow(showToAdd.display_name));

    api.addShow(showToAdd).then(({ show, episodes }) => {
      const deserializedShow = showsUtil.deserializeShow(show);
      const deserializedEpisodes = deserializeEpisodes(index(episodes));
      const showWithEpisodes = showsUtil.showWithEpisodes(deserializedShow, deserializedEpisodes);
      dispatch(showAdded(showWithEpisodes));

      const state = getState();
      cache.set(SHOWS, showsUtil.serializeShows(state.shows.get('items')));
    });
  };
}

export function updateShow (show) {
  return (dispatch, getState) => {
    api.updateShow(showsUtil.serializeShow(show.delete('episodes'))).then(() => {
      dispatch(showUpdated(show));

      cache.set(SHOWS, showsUtil.serializeShows(getState().shows.get('items')));
    });
  };
}

export function deleteShow (show) {
  return (dispatch, getState) => {
    dispatch(deletingShow(show.get('display_name')));

    api.deleteShow(showsUtil.serializeShow(show.delete('episodes'))).then(() => {
      dispatch(showDeleted(show));

      cache.set(SHOWS, showsUtil.serializeShows(getState().shows.get('items')));
    });
  };
}
