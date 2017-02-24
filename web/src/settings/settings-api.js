import { action } from 'mobx';

import api from '../data/api';
import cache, { SETTINGS } from '../data/cache';
import settingsStore from '../settings/settings-store';

function getSettingsFromCache () {
  return cache.get(SETTINGS);
}

function getSettingsFromApi () {
  return api.getSettings()
  .then((settings) => {
    cache.set(SETTINGS, settings);
    return settings;
  })
  .then(setSettings)
}

const setSettings = action('setSettings', (settings) => {
  settingsStore.setSettings(settings);
  settingsStore.isLoading = false;
});

const loadSettings = action('loadSettings', () => {
  settingsStore.isLoading = true;

  getSettingsFromCache().then((settings) => {
    if (settings) {
      setSettings(settings)
    }
    getSettingsFromApi()
  })
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
