import api from '../data/api';
import moment from 'moment';
import partial from 'lodash.partial';
import cache, { SETTINGS , DATE_SETTINGS_UPDATED } from '../data/cache';
import { deserialize, serialize } from '../settings/util';
import date from '../lib/date';

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

function getSettingsFromCache () {
  return cache.get(SETTINGS).then(settings => settings && deserialize(settings));
}

function getSettingsFromApi () {
  return api.getSettings().then((settings) => {
    cache.set(SETTINGS, settings);
    return deserialize(settings);
  });
}

function evaluateCache (settings) {
  return settings || getSettingsFromApi();
}

function dispatchSettings (dispatch, settings) {
  dispatch(receiveSettings(settings));
}

export function fetchSettings () {
  return (dispatch) => {
    const send = partial(dispatchSettings, dispatch);

    getSettingsFromCache()
      .then(evaluateCache)
      .then(send)
      .then(() => cache.get(DATE_SETTINGS_UPDATED))
      .then((dateUpdated) => {
         if (dateUpdated && !date.isToday(moment(dateUpdated.date))) {
           getSettingsFromApi().then(send);
         }
         cache.set(DATE_SETTINGS_UPDATED, date.todayObject());
      });
  };
}

export function updateSettings (settings) {
  return (dispatch, getState) => {
    api.updateSettings(serialize(settings)).then(() => {
      dispatch(settingsUpdated(settings));
      cache.set(SETTINGS, serialize(getState().settings));
    });
  };
}
