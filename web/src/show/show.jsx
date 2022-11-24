import cs from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react'
import React, { useEffect } from 'react'

import stats from '../lib/stats'
import Loader from '../loader/loader'
import Modal from '../modal/modal'
import Episodes from '../episodes/episodes'
import { inSeasons, sortAscending } from '../episodes/util'
import showsStore from '../shows/shows-store'
import { useNavigate, useParams } from 'react-router'

const EpisodesList = ({ show }) => (
  <ul>
    {
      _.map(inSeasons(show.episodes), (season) => {
        return (
          <li key={season.season} className="season">
            <h3>{season.season === 999 ? 'Specials' : `Season ${season.season}`}</h3>
            <Episodes
              show={show}
              episodes={_(season.episodes).sort(sortAscending).value()}
            />
          </li>
        )
      })
    }
  </ul>
)

export default observer(() => {
  const { id } = useParams()
  const navigate = useNavigate()

  const show = showsStore.getShowById(id)

  useEffect(() => {
    stats.send('View All Episodes', {
      showId: id,
      showName: show?.displayName,
    })
  }, [true])

  if (!show) return null

  return (
    <Modal className="all-episodes">
      <Modal.Header onClose={() => navigate('/')}>
        <h2>{show.displayName}</h2>
      </Modal.Header>
      <Modal.Content>
        <dl>
          <dt className={cs({ 'no-value': !show.network })}>Network:</dt>
          <dd>{show.network}</dd>

          <dt className={cs({ 'no-value': !show.status })}>Status:</dt>
          <dd>{show.status}</dd>
        </dl>
        {showsStore.isLoadingFromApi
          ? <Loader>Loading episodes...</Loader>
          : <EpisodesList show={show} />
        }
      </Modal.Content>
    </Modal>
  )
})
