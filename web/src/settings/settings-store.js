import {  observable } from 'mobx';
import moment from 'moment';

class SettingsStore {
  @observable last_updated;
  @observable search_link = '';
  @observable isLoading = false;

  setSettings (settings) {
    if (settings.last_updated) this.last_updated = moment(settings.last_updated);
    if (settings.view_link) this.search_link = settings.view_link
  }

  serialize () {
    return {
      last_updated: this.last_updated.toISOString(),
      view_link: this.search_link,
    };
  }
}

export default new SettingsStore();
