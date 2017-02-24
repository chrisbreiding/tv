import _ from 'lodash'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import Show from './show'

@observer
export default class Shows extends Component {
  render () {
    const { label, type, showsStore, settings } = this.props
    const shows = showsStore[type]
    if (!shows.length || !_.keys(settings).length) {
      return null
    }

    return (
      <div className={`shows ${_.kebabCase(type)}`}>
        <h2>{label}</h2>
        <ul>{_.map(shows, this._show)}</ul>
      </div>
    )
  }

  _show = (show) => {
    return <Show
     key={show.id}
     show={show}
     type={this.props.type}
     searchLink={this.props.settings.searchLink}
    />
  }
}
