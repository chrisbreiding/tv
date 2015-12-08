import axios from 'axios';
import Immutable from 'immutable';
import { index } from '../lib/episodes';

const baseUrl = localStorage.apiUrl || 'http://tvapi.crbapps.com';

export function getApiKey () {
  return localStorage.apiKey;
}

export function setApiKey (apiKey) {
  localStorage.apiKey = apiKey;
}

function headers () {
  return { api_key: getApiKey() };
}

function request (endpoint, method = 'get', data) {
  return axios({
    url: `${baseUrl}/${endpoint}`,
    headers: headers(),
    method,
    data
  });
}

export default {
  getShows () {
    return request('shows').then((response) => {
      const { shows, episodes } = response && response.data || { shows: [], episodes: [] };
      return {
        shows: Immutable.fromJS(shows),
        episodes: index(Immutable.fromJS(episodes))
      };
    });
  },

  updateShow (show) {
    return request(`shows/${show.get('id')}`, 'put', {
      show: show.toObject()
    });
  },

  deleteShow (show) {
    return request(`shows/${show.get('id')}`, 'delete');
  },

  getSettings () {
    return request('settings/1').then((response) => {
      const { setting } = response && response.data || { setting: {} };
      return Immutable.Map(setting);
    });
  },

  updateSettings (settings) {
    return request('settings/1', 'put', {
      setting: settings.toObject()
    });
  },
};
