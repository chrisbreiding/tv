import _ from 'lodash'
import { action, makeObservable, observable } from 'mobx'

class MessagesStore {
  messages = []

  constructor () {
    makeObservable(this, {
      messages: observable,

      add: action,
      remove: action,
    })
  }

  add = (message) => {
    const messageObject = {
      type: 'info',
      dismissable: false,
      ...message,
      id: _.uniqueId('message-'),
    }

    this.messages.push(messageObject)

    return messageObject.id
  }

  remove = (messageId) => {
    this.messages = _.reject(this.messages, ({ id }) => {
      return messageId === id
    })
  }
}

export default new MessagesStore()
