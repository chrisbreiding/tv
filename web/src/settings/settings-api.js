import { action } from 'mobx';
import moment from 'moment';

import api from '../data/api';
import cache, { DATE_SETTINGS_UPDATED, SETTINGS } from '../data/cache';
import date from '../lib/date';
import settingsStore from '../settings/settings-store';

function getSettingsFromCache () {
  return cache.get(SETTINGS);
}

function getSettingsFromApi () {
  return api.getSettings().then((settings) => {
    cache.set(SETTINGS, settings);
    return settings;
  });
}

function evaluateCache (settings) {
  return settings || getSettingsFromApi();
}

const setSettings = action('setSettings', (settings) => {
  settingsStore.setSettings(settings);
  settingsStore.isLoading = false;
});

const loadSettings = action('loadSettings', () => {
  settingsStore.isLoading = true;

  getSettingsFromCache()
    .then(evaluateCache)
    .then(setSettings)
    .then(() => cache.get(DATE_SETTINGS_UPDATED))
    .then((dateUpdated) => {
      if (dateUpdated && !date.isToday(moment(dateUpdated.date))) {
        getSettingsFromApi().then(setSettings);
      }
      cache.set(DATE_SETTINGS_UPDATED, date.todayObject());
    });
})

const updateSettings = (settings) => {
  const settingsProps = {
    view_link: settings.searchLink,
  }
  api.updateSettings(settingsProps).then(() => {
    setSettings(settingsProps);
    cache.set(SETTINGS, settingsStore.serialize());
  });
};

export {
  loadSettings,
  updateSettings,
};
