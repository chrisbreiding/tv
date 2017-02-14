const _ = require('lodash')
const ipc = require('./ipc')

const queue = {}

module.exports = {
  add (id, data) {
    queue[id] = data
    queue[id].id = id
    ipc.send('queue:episode:added', data)
  },

  update (id, partialData) {
    queue[id] = _.extend(queue[id], partialData)
    ipc.send('queue:episode:updated', queue[id])
  },

  remove (id) {
    delete queue[id]
  },

  find (query) {
    return _.find(queue, query)
  },

  has (id) {
    return !!queue[id]
  },

  isEmpty () {
    return !_.size(queue)
  },

  STARTED: 'STARTED',
  SEARCHING_TORRENTS: 'SEARCHING_TORRENTS',
  USER_SELECTING_TORRENT: 'USER_SELECTING_TORRENT',
  DOWNLOADING_TORRENT: 'DOWNLOADING_TORRENT',
  REMOVING_TORRENT: 'REMOVING_TORRENT',
  COPYING_FILE: 'COPYING_FILE',
  TRASHING_TORRENT_FILES: 'TRASHING_TORRENT_FILES',
  FINISHED: 'FINISHED',
  CANCELED: 'CANCELED',
  ERROR: 'ERROR',
}
