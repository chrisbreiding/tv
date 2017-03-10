const _ = require('lodash')
const ipc = require('./ipc')

let queue = []
let numSucceeded = 0

module.exports = {
  add (data) {
    queue.push(data)
    ipc.send('queue:episode:added', data)
    return null
  },

  update (partialData) {
    const { id } = partialData
    const item = _.find(queue, { id })
    if (!item) {
      console.error(`Tried to update queue item (with id '${id}') that does not exist`) // eslint-disable-line no-console
      return
    }
    _.extend(item, partialData)
    ipc.send('queue:episode:updated', item)
    if (item.state === this.FINISHED) {
      numSucceeded++
    }
    return null
  },

  remove (id) {
    queue = _.filter(queue, (item) => item.id !== id)
  },

  reset () {
    numSucceeded = 0
  },

  find (query) {
    return _.find(queue, query)
  },

  has (id) {
    return !!this.find({ id })
  },

  size () {
    return queue.length
  },

  numSucceeded () {
    return numSucceeded
  },

  items () {
    return queue
  },

  STARTED: 'STARTED',
  SEARCHING_TORRENTS: 'SEARCHING_TORRENTS',
  SELECT_TORRENT: 'SELECT_TORRENT',
  ADDING_TORRENT: 'ADDING_TORRENT',
  DOWNLOADING_TORRENT: 'DOWNLOADING_TORRENT',
  REMOVING_TORRENT: 'REMOVING_TORRENT',
  SELECT_FILE: 'SELECT_FILE',
  COPYING_FILE: 'COPYING_FILE',
  TRASHING_TORRENT_FILES: 'TRASHING_TORRENT_FILES',
  FINISHED: 'FINISHED',
  CANCELING: 'CANCELING',
  CANCELED: 'CANCELED',
  FAILED: 'FAILED',
}
