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

function request (endpoint, method = 'get', props = {}) {
  return axios(Object.assign({
    url: `${baseUrl}/${endpoint}`,
    headers: headers(),
    method
  }, props));
}

export default {
  getShows () {
    return request('shows').then((response) => {
      const { shows, episodes } = response && response.data || { shows: [], episodes: [] };
      return {
        shows: Immutable.fromJS(shows),
        episodes: Immutable.fromJS(episodes)
      };
    });
  },

  addShow (show) {
    return request('shows', 'post', {
      data: { show }
    }).then((response) => {
      const { show, episodes } = response.data;
      return {
        show: Immutable.fromJS(show),
        episodes: index(Immutable.fromJS(episodes))
      };
    });
  },

  updateShow (show) {
    return request(`shows/${show.get('id')}`, 'put', {
      data: {
        show: show.toObject()
      }
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

  searchSourceShows (query) {
    return request('source_shows', 'get', {
      params: {
        query: query
      }
    }).then((response) => {
      const { source_shows } = response && response.data || { source_shows: [] };
      return Immutable.fromJS(source_shows);
    });
  },
};
