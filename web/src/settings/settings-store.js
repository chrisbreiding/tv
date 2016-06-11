import _ from 'lodash';
import {  observable } from 'mobx';
import moment from 'moment';

class SettingsStore {
  @observable last_updated;
  @observable view_link = '';
  @observable isLoading = false;

  setSettings (settings) {
    _.each(settings, (value, key) => {
      if (key === 'last_updated') {
        value = moment(value);
      }
      this[key] = value;
    });
  }

  serialize () {
    return {
      view_link: this.view_link,
    };
  }
}

export default new SettingsStore();
