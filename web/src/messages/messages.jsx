import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'

import messagesStore from './messages-store'

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
              <FontAwesomeIcon icon={faXmark} />
            </button>
          }
        </li>
      ))}
    </ul>
  )
})
