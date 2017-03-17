import cs from 'classnames'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { withRouter } from 'react-router'

import stats from '../lib/stats'
import Modal from '../modal/modal'
import { AutoFocusedInput } from '../lib/form'
import searchStore from './search-store'

@withRouter
@observer
export default class Search extends Component {
  componentWillMount () {
    stats.send('Visit Search')
  }

  render () {
    return (
      <Modal className={cs('search', {
        'has-query': !!this.props.params.query,
        'has-results': !!searchStore.results.length,
      })}>
        <Modal.Header onClose={this._close}>
          <h2>Search Shows</h2>
          <form onSubmit={this._search}>
            <AutoFocusedInput ref="query" defaultValue={this.props.params.query} />
            <button type="submit">Search</button>
          </form>
        </Modal.Header>
        <Modal.Content>
          {this.props.children}
        </Modal.Content>
      </Modal>
    )
  }

  _search = (e) => {
    e.preventDefault()

    stats.send('Search', {
      query: this.refs.query.value,
    })

    this.props.router.push(`/search/${this.refs.query.value}`)
  }

  _close = () => {
    this.props.router.push('/')
  }
}
