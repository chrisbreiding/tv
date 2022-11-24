import { observer } from 'mobx-react'
import React, { useEffect } from 'react'

import stats from '../lib/stats'
import { addShow } from '../shows/shows-api'
import showsStore from '../shows/shows-store'
import searchStore from './search-store'

import Result from './result'
import Loader from '../loader/loader'
import { useNavigate, useParams } from 'react-router'

const search = (query) => {
  if (query) {
    searchStore.searchShows(query)
  }
}

export default observer(() => {
  const { query } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    search(query)
  }, [query])

  const exists = (sourceShow) => {
    return showsStore.hasSourceShow(sourceShow)
  }

  const add = (show) => {
    stats.send('Add Show', {
      name: show.name,
      showId: show.id,
    })

    addShow(show)
    navigate('/')
  }

  const searchResults = searchStore.results

  if (searchStore.isLoading) {
    return (
      <p className="no-results">
        <Loader>Searching...</Loader>
      </p>
    )
  } else if (query == null) {
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
            exists={exists(show)}
            onAddShow={() => add(show)}
          />
        )
      })}
    </ul>
  )
})
