import uniqueId from 'lodash/uniqueId'
import { action, makeObservable, observable } from 'mobx'

interface Message {
  dismissable: boolean
  id: string
  message: string
  type: 'info' | 'error'
}

type MessageProps = {
  dismissable?: boolean
  message: string
  type?: 'info' | 'error'
}

class MessagesStore {
  messages: Message[] = []

  constructor () {
    makeObservable(this, {
      messages: observable,

      add: action,
      remove: action,
    })
  }

  add = (message: MessageProps) => {
    const messageObject = {
      dismissable: false,
      type: 'info',
      ...message,
      id: uniqueId('message-'),
    } as Message

    this.messages.push(messageObject)

    return messageObject.id
  }

  remove = (messageId: string) => {
    this.messages = this.messages.filter(({ id }) => {
      return messageId !== id
    })
  }
}

export const messagesStore = new MessagesStore()
