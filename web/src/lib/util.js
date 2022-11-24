import { EventEmitter } from 'events'

export const eventBus = new EventEmitter()

export const pad = (num) => num < 10 ? `0${num}` : `${num}`

export const searchLink = (link, showName, episodeNumber) => {
  return link
  .replace(/\[show name]/g, showName)
  .replace(/\[episode]/g, episodeNumber)
}
