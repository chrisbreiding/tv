import axios from 'axios';

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
      return response && response.data;
    });
  }
};
