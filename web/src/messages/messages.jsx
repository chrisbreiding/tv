import _ from 'lodash'
import React from 'react'
import messagesStore from './messages-store'

import { observer } from 'mobx-react'

export default observer(() => {
  const messages = messagesStore.messages
  if (!messages.length) return null

  const remove = (id) => () => {
    messagesStore.remove(id)
  }

  return (
    <ul className="messages">
      {_.map(messages, ({ id, message, type, dismissable }) => (
        <li key={id} className={`type-${type}`}>
          <span>{message}</span>
          {dismissable &&
            <button onClick={remove(id)}>
              <i className="fa fa-remove" />
            </button>
          }
        </li>
      ))}
    </ul>
  )
})
