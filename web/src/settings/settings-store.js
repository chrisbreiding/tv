import {  observable } from 'mobx';
import moment from 'moment';

class SettingsStore {
  @observable lastUpdated;
  @observable searchLink = '';
  @observable isLoading = false;

  setSettings (settings) {
    if (settings.last_updated) this.lastUpdated = moment(settings.last_updated);
    if (settings.view_link) this.searchLink = settings.view_link
  }

  serialize () {
    return {
      last_updated: this.lastUpdated.toISOString(),
      view_link: this.searchLink,
    };
  }
}

export default new SettingsStore();
