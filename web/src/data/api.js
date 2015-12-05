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

const headers = () => { return { api_key: getApiKey() }; };

export default {
  getShows () {
    return axios({
      url:`${baseUrl}/shows`,
      headers: headers()
    }).then((response) => {
      const { shows, episodes } = response && response.data || { shows: [], episodes: [] };
      return {
        shows: Immutable.fromJS(shows),
        episodes: index(Immutable.fromJS(episodes))
      };
    });
  }
};
