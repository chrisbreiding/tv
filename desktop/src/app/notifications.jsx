import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'

import state from './state'

const remove = (id) => () => {
  state.removeNotification(id)
}

// TODO: add expandable message
const Notifications = observer(() => (
  <ul className='notifications'>
    {_.map(state.notifications, ({ id, type, title }) => (
      <li key={id} className={type}>
        <p>{title}</p>
        <button onClick={remove(id)}>
          <i className='fa fa-remove'></i>
        </button>
      </li>
    ))}
  </ul>
))

export default Notifications
