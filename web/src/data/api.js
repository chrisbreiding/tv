import axios from 'axios'
import messagesStore from '../messages/messages-store'

const baseUrl = localStorage.apiUrl || 'https://proxy.crbapps.com/tv'
const desktopBaseUrl = 'http://localhost:4192'

export function getApiKey () {
  return localStorage.apiKey
}

export function setApiKey (apiKey) {
  localStorage.apiKey = apiKey
}

export function posterUrl (poster) {
  return `${baseUrl}/shows/poster/${btoa(poster)}?apiKey=${getApiKey()}`
}

function headers () {
  return { 'api-key': getApiKey() }
}

async function apiRequest (endpoint, method = 'get', props = {}) {
  const { data } = await axios(Object.assign({
    url: `${baseUrl}/${endpoint}`,
    headers: headers(),
    method,
  }, props)) || {}

  return data
}

function logError (error, message) {
  // eslint-disable-next-line no-console
  console.log({
    message: error.message,
    stack: error.stack,
    response: error.response,
  })

  if (error.response?.status !== 401) {
    // 401 redirects to /auth and shouldn't surface this message to user
    messagesStore.add({
      dismissable: true,
      message,
      type: 'error',
    })
  }
}

async function desktopRequest (endpoint, data = {}) {
  try {
    return await axios.post(`${desktopBaseUrl}/${endpoint}`, data)
  } catch (error) {
    console.log(error.stack) // eslint-disable-line no-console

    messagesStore.add({
      dismissable: true,
      message: 'Desktop request failed. See console for more information.',
      type: 'error',
    })
  }
}

function pingDesktop (callback) {
  return axios.get(`${desktopBaseUrl}/ping`)
  .then(() => callback(true))
  .catch(() => callback(false))
}

export default {
  pollDesktopConnection (callback) {
    if (window.location.hostname === 'localhost') return

    setInterval(() => pingDesktop(callback), 10000)
    pingDesktop(callback)
  },

  moveEpisode (episode) {
    return desktopRequest('move', { episode })
  },

  downloadEpisode (episode) {
    return desktopRequest('download', { episode })
  },

  getShows () {
    return apiRequest('shows').catch((error) => {
      logError(error, 'Failed to get shows')

      return []
    })
  },

  addShow (show) {
    return apiRequest('shows', 'post', { data: { show } }).catch((error) => {
      logError(error, 'Failed to add show')
    })
  },

  updateShow (show) {
    return apiRequest(`shows/${show.id}`, 'put', { data: { show } }).catch((error) => {
      logError(error, 'Failed to update show')
    })
  },

  deleteShow ({ id }) {
    return apiRequest(`shows/${id}`, 'delete').catch((error) => {
      logError(error, 'Failed to delete show')
    })
  },

  getSettings () {
    return apiRequest('user').catch((error) => {
      logError(error, 'Failed to get settings')
    })
  },

  updateSettings (settings) {
    return apiRequest('user', 'put', { data: settings })
    .then(() => true)
    .catch((error) => {
      logError(error, 'Failed to update settings')

      return false
    })
  },

  searchShows (query) {
    return apiRequest('shows/search', 'get', { params: { query } }).catch((error) => {
      logError(error, 'Failed to search shows')

      return []
    })
  },

  sendStats (event, data) {
    return apiRequest('stats', 'post', { data: { event, data } }).catch(() => {})
  },
}
