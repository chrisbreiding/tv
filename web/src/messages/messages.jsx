import _ from 'lodash'
import React from 'react'
import messagesStore from './messages-store'

import { observer } from 'mobx-react'

export default observer(() => {
  const messages = messagesStore.messages
  if (!messages.length) return null

  return (
    <ul className="messages">
      {_.map(messages, (message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  )
})
