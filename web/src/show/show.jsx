import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { withRouter } from 'react-router'

import Loader from '../loader/loader'
import Modal from '../modal/modal'
import Episodes from '../episodes/episodes'
import { inSeasons, sortAscending } from '../episodes/util'
import showsStore from '../shows/shows-store'

export default withRouter(observer(function Show ({ params, router }) {
  const show = showsStore.getShowById(Number(params.id))
  if (!show) return null

  const seasons = inSeasons(show.episodes)

  return (
    <Modal className="all-episodes">
      <Modal.Header onClose={() => router.push('/')}>
        <h2>{show.displayName}</h2>
        {showsStore.isLoadingFromApi && (
          <Loader>Loading older episodes...</Loader>
        )}
      </Modal.Header>
      <Modal.Content>
        <ul>
          {
            _.map(seasons, (season) => {
              return (
                <li key={season.season} className="season">
                  <h3>
                    <span>
                      {season.season === 999 ? 'Specials' : `Season ${season.season}`}
                    </span>
                  </h3>
                  <Episodes
                    show={show}
                    episodes={_(season.episodes).sort(sortAscending).value()}
                  />
                </li>
              )
            })
          }
        </ul>
      </Modal.Content>
    </Modal>
  )
}))
