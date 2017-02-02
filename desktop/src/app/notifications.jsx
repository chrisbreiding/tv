import cs from 'classnames'
import _ from 'lodash'
import Markdown from 'markdown-it'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

import state from './state'

const md = new Markdown()

@observer
class Notification extends Component {
  @observable isExpanded = false

  componentDidMount () {
    this.autoRemoveTimeout = setTimeout(this._remove, 10000)
  }

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
          <button onClick={this._remove}>
            <i className='fa fa-remove'></i>
          </button>
        </div>
        <div className='expanded-content' dangerouslySetInnerHTML={{ __html: md.render(message) }}></div>
      </li>
    )
  }

  _toggleExpanded = () => {
    clearTimeout(this.autoRemoveTimeout)
    this.isExpanded = !this.isExpanded
  }

  _remove = () => {
    state.removeNotification(this.props.notification.id)
  }
}

const Notifications = observer(() => (
  <ul className='notifications'>
    {_.map(state.notifications, (notification) => (
      <Notification key={notification.id} notification={notification} />
    ))}
  </ul>
))

export default Notifications
