import cs from 'classnames'
import _ from 'lodash'
import Markdown from 'markdown-it'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

import ipc from '../lib/ipc'

const md = new Markdown()

@observer
class Notification extends Component {
  @observable isExpanded = false

  render () {
    const { message, title, type } = this.props.notification

    return (
      <li className={cs(type, {
        'is-expanded': this.isExpanded,
        'has-message': !!message,
      })}>
        <div className='content'>
          <button onClick={this._toggleExpanded}>
            <i className='fa fa-fw'></i>
          </button>
          <p dangerouslySetInnerHTML={{ __html: md.render(title) }}></p>
          <button onClick={this.props.onRemove}>
            <i className='fa fa-remove'></i>
          </button>
        </div>
        <div className='expanded-content' dangerouslySetInnerHTML={{ __html: md.render(message) }}></div>
      </li>
    )
  }

  @action _toggleExpanded = () => {
    this.isExpanded = !this.isExpanded
  }
}

@observer
class Notifications extends Component {
  @observable notifications = []

  render () {
    return (
      <ul className='notifications'>
        {_.map(this.notifications, (notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onRemove={this._remove(notification.id)}
          />
        ))}
      </ul>
    )
  }

  componentDidMount () {
    ipc.on('notification', action((notification) => {
      this._add(notification)
    }))
  }

  _add (notification) {
    if (!notification) return

    notification.id = _.uniqueId()
    notification.title = notification.title || ''
    notification.message = notification.message || ''
    this.notifications.push(notification)
  }

  _remove = (id) => action(() => {
    const index = _.findIndex(this.notifications, { id })
    this.notifications.splice(index, 1)
  })
}

export default Notifications
