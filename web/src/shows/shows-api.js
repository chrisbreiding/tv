import { action } from 'mobx'

import cache, { SHOWS } from '../data/cache'
import api from '../data/api'
import messagesStore from '../messages/messages-store'
import showsStore from './shows-store'

function getShowsFromCache () {
  return cache.get(SHOWS)
}

function saveShowsToCache () {
  cache.set(SHOWS, showsStore.serialize())
}

const getShowsFromApi = action(() => {
  showsStore.setIsLoadingfromApi(true)

  api.getShows()
  .then(updateShows(true))
  .then(action(() => {
    showsStore.setIsLoadingfromApi(false)
  }))
})

const updateShows = (updateCache) => action('updateShows', (shows) => {
  showsStore.setShows(shows)
  showsStore.setIsLoadingfromCache(false)
  if (updateCache) {
    saveShowsToCache()
  }
})

const loadShows = action('loadShows', () => {
  showsStore.setIsLoadingfromCache(true)

  getShowsFromCache().then((shows) => {
    if (shows) {
      updateShows(false)(shows)
    }
    getShowsFromApi()
  })
})

const addShow = action('addShow', (showToAdd) => {
  const messageId = messagesStore.add({ message: `Adding ${showToAdd.name}...` })
  api.addShow(showToAdd).then(action('showAdded', (show) => {
    if (show) {
      showsStore.addShow(show)
      saveShowsToCache()
    }
    messagesStore.remove(messageId)
  }))
})

const updateShow = action('updateShow', (showProps) => {
  api.updateShow(showProps)
  showsStore.updateShow(showProps)
  saveShowsToCache()
})

const deleteShow = action('deleteShow', (show) => {
  api.deleteShow(show)
  showsStore.deleteShow(show)
  saveShowsToCache()
})

export {
  loadShows,
  addShow,
  updateShow,
  deleteShow,
}
