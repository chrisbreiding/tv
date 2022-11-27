import { cache, SHOWS_KEY } from '../data/cache'
import {
  getShows as getRemoteShows,
  addShow as addRemoteShow,
  updateShow as updateRemoteShow,
  deleteShow as deleteRemoteShow,
} from '../data/remote'
import type { ShowProps, UpdateShowProps } from '../lib/types'
import { messagesStore } from '../messages/messages-store'
import type { SearchResultShowModel } from '../search/search-result-show-model'
import type { ShowModel } from './show-model'
import { showsStore } from './shows-store'

function getShowsFromCache () {
  return cache.get<ShowProps[]>(SHOWS_KEY)
}

function saveShowsToCache () {
  cache.set<ShowProps[]>(SHOWS_KEY, showsStore.serialize())
}

async function getShowsFromRemote () {
  showsStore.setIsLoadingFromRemote(true)

  const shows = await getRemoteShows()

  updateShows(shows, true)
  showsStore.setIsLoadingFromRemote(false)
}

function updateShows (shows: ShowProps[], updateCache: boolean) {
  showsStore.setShows(shows)
  showsStore.setIsLoadingFromCache(false)

  if (updateCache) {
    saveShowsToCache()
  }
}

export async function loadShows () {
  showsStore.setIsLoadingFromCache(true)

  const shows = await getShowsFromCache()

  if (shows) {
    updateShows(shows, false)
  }
  getShowsFromRemote()
}

export async function addShow (showToAdd: SearchResultShowModel) {
  const messageId = messagesStore.add({ message: `Adding ${showToAdd.name}...` })

  const show = await addRemoteShow(showToAdd)

  if (show) {
    showsStore.addShow(show)
    saveShowsToCache()
  }
  messagesStore.remove(messageId)
}

export function updateShow (showProps: UpdateShowProps) {
  updateRemoteShow(showProps)
  showsStore.updateShow(showProps)
  saveShowsToCache()
}

export function deleteShow (show: ShowModel) {
  deleteRemoteShow(show)
  showsStore.deleteShow(show)
  saveShowsToCache()
}
