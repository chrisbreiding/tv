import axios from 'axios';

const baseUrl = localStorage.apiUrl || 'http://tvapi.crbapps.com';
const desktopBaseUrl = 'http://localhost:4192';

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
    method,
  }, props));
}

export default {
  pingDesktop () {
    return axios.get(`${desktopBaseUrl}/ping`)
    .then(() => true)
    .catch(() => false)
  },

  handleEpisode (episode) {
    return axios.post(desktopBaseUrl, { episode })
  },

  getShows () {
    return request('shows').then((response) => {
      return response && response.data || { shows: [], episodes: [] };
    });
  },

  addShow (show) {
    return request('shows', 'post', { data: { show } }).then((response) => {
      return response.data;
    });
  },

  updateShow (show) {
    return request(`shows/${show.id}`, 'put', { data: { show } });
  },

  deleteShow ({ id }) {
    return request(`shows/${id}`, 'delete');
  },

  getSettings () {
    return request('settings/1').then((response) => {
      return response && response.data && response.data.setting || {};
    });
  },

  updateSettings (setting) {
    return request('settings/1', 'put', { data: { setting } });
  },

  searchSourceShows (query) {
    return request('source_shows', 'get', { params: { query } }).then((response) => {
      return response && response.data && response.data.source_shows || [];
    });
  },
};
