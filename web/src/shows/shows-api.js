import { action } from 'mobx'

import cache, { SHOWS } from '../data/cache'
import api from '../data/api'
import messagesStore from '../messages/messages-store'
import showsStore from './shows-store'
import util from '../lib/util'

function getShowsFromCache () {
  return cache.get(SHOWS)
}

function saveShowsToCache () {
  cache.set(SHOWS, showsStore.serialize())
}

const getShowsFromApi = action(() => {
  showsStore.isLoadingFromApi = true

  api.getShows()
  .then(({ shows, episodes }) => {
    return showsStore.showsWithEpisodes(shows, episodes)
  })
  .then(updateShows(true))
  .then(action(() => {
    showsStore.isLoadingFromApi = false
  }))
})

const updateShows = (updateCache) => action('updateShows', (shows) => {
  showsStore.setShows(shows)
  showsStore.isLoadingFromCache = false
  if (updateCache) {
    saveShowsToCache()
  }
})

const loadShows = action('loadShows', () => {
  showsStore.isLoadingFromCache = true

  getShowsFromCache().then((shows) => {
    if (shows) {
      updateShows(false)(shows)
    }
    getShowsFromApi()
  })
})

const addShow = action('addShow', (showToAdd) => {
  const message = messagesStore.add(`Adding ${showToAdd.displayName}...`)
  api.addShow(util.keysToSnakeCase(showToAdd)).then(action('showAdded', ({ show, episodes }) => {
    const showWithEpisodes = showsStore.showsWithEpisodes([show], episodes)[0]
    showsStore.addShow(showWithEpisodes)
    saveShowsToCache()
    messagesStore.remove(message)
  }))
})

const updateShow = action('updateShow', (showProps) => {
  api.updateShow(util.keysToSnakeCase(showProps))
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
