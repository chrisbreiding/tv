import localforage from 'localforage'

export const SHOWS = 'shows'
export const SETTINGS = 'settings'

if (localStorage.debug) {
  window.localforage = localforage
}

export default {
  get (name) {
    return localforage.getItem(`cache-${name}`)
  },

  set (name, data) {
    return localforage.setItem(`cache-${name}`, data)
  },

  clear () {
    return localforage.clear()
  },
}
