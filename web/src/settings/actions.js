import api from '../data/api';

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
