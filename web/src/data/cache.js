import Immutable from 'immutable';
import localforage from 'localforage';

export const SHOWS = 'shows';
export const EPISODES = 'episodes';
export const SETTINGS = 'settings';
export const DATE_SHOWS_UPDATED = 'date-shows-updated';
export const DATE_SETTINGS_UPDATED = 'date-settings-updated';

export default {
  get (name) {
    return localforage.getItem(`cache-${name}`).then((data) => {
      return Immutable.fromJS(data);
    });
  },

  set (name, data) {
    localforage.setItem(`cache-${name}`, data.toJS());
  },
};
