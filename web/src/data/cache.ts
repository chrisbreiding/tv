import localforage from 'localforage'

declare global {
  interface Window {
    localforage?: typeof localforage
  }
}

export type Storable<T> =
| string
| number
| boolean
| null
| Storable<T>[]
| { [key in keyof T]: Storable<T[key]> }

export const SHOWS_KEY = 'shows'
export const SETTINGS_KEY = 'settings'

if (localStorage.debug) {
  window.localforage = localforage
}

export const cache = {
  get<T> (name: string) {
    return localforage.getItem<T>(`cache-${name}`)
  },

  set<T> (name: string, data: Storable<T>) {
    return localforage.setItem(`cache-${name}`, data)
  },

  clear () {
    return localforage.clear()
  },
}
