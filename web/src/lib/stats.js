import api from '../data/api'

export default {
  send (eventName, data) {
    api.sendStats(eventName, data)
  },
}
