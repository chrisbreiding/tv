import axios, { AxiosError } from 'axios'
import type { EpisodeDetails } from '../episodes/episode'
import type {
  SearchResultShowProps,
  SettingsProps,
  ShowProps,
  UpdateSettingsProps,
  UpdateShowProps,
} from '../lib/types'
import { messagesStore } from '../messages/messages-store'
import type { SearchResultShowModel } from '../search/search-result-show-model'

const baseUrl = localStorage.apiUrl || 'https://proxy.crbapps.com/tv'
const desktopBaseUrl = 'http://localhost:4192'

export function getApiKey () {
  return localStorage.apiKey as string | undefined
}

export function setApiKey (apiKey: string) {
  localStorage.apiKey = apiKey
}

export function posterUrl (poster: string) {
  return `${baseUrl}/shows/poster/${btoa(poster)}?apiKey=${getApiKey()}`
}

function headers () {
  return { 'api-key': getApiKey() }
}

interface RequestProps {
  data?: object
  params?: Record<string, string>
}

async function remoteRequest<T> (endpoint: string, method = 'get', props: RequestProps = {}): Promise<T> {
  const { data } = await axios(Object.assign({
    url: `${baseUrl}/${endpoint}`,
    headers: headers(),
    method,
  }, props)) as { data: T }

  return data
}

function logError (error: AxiosError, message: string) {
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

async function desktopRequest (endpoint: string, data: object = {}) {
  try {
    return await axios.post(`${desktopBaseUrl}/${endpoint}`, data)
  } catch (error: any) {
    console.log(error.stack) // eslint-disable-line no-console

    messagesStore.add({
      dismissable: true,
      message: 'Desktop request failed. See console for more information.',
      type: 'error',
    })
  }
}

function pingDesktop (callback: (available: boolean) => void) {
  return axios.get(`${desktopBaseUrl}/ping`)
  .then(() => callback(true))
  .catch(() => callback(false))
}

export function pollDesktopConnection (callback: (available: boolean) => void) {
  if (window.location.hostname === 'localhost') return

  setInterval(() => pingDesktop(callback), 10000)
  pingDesktop(callback)
}

export function moveEpisode (episode: EpisodeDetails) {
  return desktopRequest('move', { episode })
}

export function downloadEpisode (episode: EpisodeDetails) {
  return desktopRequest('download', { episode })
}

export function searchShows (query: string) {
  return remoteRequest<SearchResultShowProps[]>('shows/search', 'get', { params: { query } }).catch((error: AxiosError) => {
    logError(error, 'Failed to search shows')

    return [] as SearchResultShowProps[]
  })
}

export function getShows () {
  return remoteRequest<ShowProps[]>('shows').catch((error: AxiosError) => {
    logError(error, 'Failed to get shows')

    return [] as ShowProps[]
  })
}

export function addShow (show: SearchResultShowModel) {
  return remoteRequest<ShowProps>('shows', 'post', { data: { show } }).catch((error: AxiosError) => {
    logError(error, 'Failed to add show')
  })
}

export function updateShow (show: UpdateShowProps) {
  return remoteRequest<ShowProps>(`shows/${show.id}`, 'put', { data: { show } }).catch((error: AxiosError) => {
    logError(error, 'Failed to update show')
  })
}

export function deleteShow ({ id }: { id: string }) {
  return remoteRequest<void>(`shows/${id}`, 'delete').catch((error: AxiosError) => {
    logError(error, 'Failed to delete show')
  })
}

export function getSettings () {
  return remoteRequest<SettingsProps>('user').catch((error: AxiosError) => {
    logError(error, 'Failed to get settings')
  })
}

export function updateSettings (settings: Omit<UpdateSettingsProps, 'preferredView'>) {
  return remoteRequest('user', 'put', { data: settings })
  .then(() => true)
  .catch((error: AxiosError) => {
    logError(error, 'Failed to update settings')

    return false
  })
}

export function sendStats (event: string, data?: any) {
  return remoteRequest<void>('stats', 'post', { data: { event, data } }).catch(() => {})
}
