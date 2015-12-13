import api from '../data/api';
import cache, { SETTINGS } from '../data/cache';

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

function getSettingsFromApi () {
  return api.getSettings().then((settings) => {
    cache.set(SETTINGS, settings);
    return settings;
  });
}

export function fetchSettings () {
  return (dispatch) => {
    cache.get(SETTINGS).then((settings) => {
      return settings || getSettingsFromApi();
    }).then((settings) => {
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
