import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { addShow } from '../shows/shows-api'
import { showsStore } from '../shows/shows-store'
import { searchStore } from './search-store'

import { sendStats } from '../data/remote'
import { Loader } from '../loader/loader'
import { Result } from './result'
import type { SearchResultShowModel } from './search-result-show-model'

const search = (query?: string) => {
  if (query) {
    searchStore.searchShows(query)
  }
}

export const Results = observer(() => {
  const { query } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    search(query)
  }, [query])

  const add = (show: SearchResultShowModel) => {
    sendStats('Add Show', {
      name: show.name,
      showId: show.id,
    })

    addShow(show)
    navigate('../..')
  }

  const { isLoading, results } = searchStore

  if (isLoading) {
    return (
      <p className="no-results">
        <Loader>Searching...</Loader>
      </p>
    )
  } else if (query == null) {
    return null
  } else if (!results.length) {
    return <p className="no-results">No shows found</p>
  }

  return (
    <ul className="results">
      {results.map((show) => {
        return (
          <Result
            key={show.id}
            show={show}
            exists={showsStore.hasShow(show)}
            onAddShow={() => add(show)}
          />
        )
      })}
    </ul>
  )
})
