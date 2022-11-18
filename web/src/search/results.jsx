import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { withRouter } from 'react-router'

import stats from '../lib/stats'
import { addShow } from '../shows/shows-api'
import showsStore from '../shows/shows-store'
import searchStore from './search-store'

import Result from './result'
import Loader from '../loader/loader'

class SearchResults extends Component {
  componentWillMount () {
    this._search(this.props.params.query)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.params.query !== nextProps.params.query) {
      this._search(nextProps.params.query)
    }
  }

  _search (query) {
    if (query) {
      searchStore.searchShows(query)
    }
  }

  render () {
    const searchResults = searchStore.results

    if (searchStore.isLoading) {
      return (
        <p className="no-results">
          <Loader>Searching...</Loader>
        </p>
      )
    } else if (this.props.params.query == null) {
      return null
    } else if (!searchResults.length) {
      return <p className="no-results">No shows found</p>
    }

    return (
      <ul className="results">
        {searchResults.map((show) => {
          return (
            <Result
              key={show.id}
              show={show}
              exists={this._exists(show)}
              onAddShow={() => this._addShow(show)}
            />
          )
        })}
      </ul>
    )
  }

  _exists (sourceShow) {
    return showsStore.hasSourceShow(sourceShow)
  }

  _addShow (show) {
    const name = show.name

    stats.send('Add Show', {
      name,
      showId: show.id,
    })

    addShow(show)

    this.props.router.push('/')
  }
}

export default withRouter(observer(SearchResults))
