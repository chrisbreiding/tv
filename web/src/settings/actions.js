import api from '../data/api';
import Immutable from 'immutable';
import moment from 'moment';
import cache, { SETTINGS , DATE_SETTINGS_UPDATED } from '../data/cache';
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
  return Promise.all([
    cache.get(SETTINGS),
    cache.get(DATE_SETTINGS_UPDATED)
  ]);
}

function getSettingsFromApi () {
  return api.getSettings().then((settings) => {
    cache.set(SETTINGS, settings);
    cache.set(DATE_SETTINGS_UPDATED, date.todayMap());
    return settings;
  });
}

function evaluateCache ([settings, dateUpdated]) {
  return settings && dateUpdated && date.isToday(moment(dateUpdated.get('date'))) ?
    settings :
    getSettingsFromApi();
}

export function fetchSettings () {
  return (dispatch) => {
    getSettingsFromCache()
      .then(evaluateCache)
      .then((settings) => {
        dispatch(receiveSettings(settings));
      });
  };
}

export function updateSettings (settings) {
  return (dispatch, getState) => {
    api.updateSettings(settings).then(() => {
      dispatch(settingsUpdated(settings));
      cache.set(SETTINGS, getState().settings);
    });
  };
}
