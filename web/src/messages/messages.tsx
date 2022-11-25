import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import React from 'react'

import { messagesStore } from './messages-store'

export const Messages = observer(() => {
  const messages = messagesStore.messages

  if (!messages.length) return null

  const remove = (id: string) => () => {
    messagesStore.remove(id)
  }

  return (
    <ul className="messages">
      {messages.map(({ id, message, type, dismissable }) => (
        <li key={id} className={`type-${type}`}>
          <span>{message}</span>
          {dismissable &&
            <button onClick={remove(id)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          }
        </li>
      ))}
    </ul>
  )
})
