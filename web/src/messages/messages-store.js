import _ from 'lodash'
import { action, extendObservable } from 'mobx'

class MessagesStore {
  constructor () {
    extendObservable(this, {
      messages: [],
    })
  }

  add = action((message) => {
    const messageObject = {
      type: 'info',
      dismissable: false,
      ...message,
      id: _.uniqueId('message-'),
    }

    this.messages.push(messageObject)

    return messageObject.id
  })

  remove = action((messageId) => {
    this.messages = _.reject(this.messages, ({ id }) => {
      return messageId === id
    })
  })
}

export default new MessagesStore()
