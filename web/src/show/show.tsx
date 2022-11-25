import cs from 'classnames'
import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { sendStats } from '../data/remote'
import { Episodes } from '../episodes/episodes'
import { inSeasons, sortAscending } from '../episodes/util'
import { Loader } from '../loader/loader'
import { Modal, ModalContent, ModalHeader } from '../modal/modal'
import type { ShowModel } from '../shows/show-model'
import { showsStore } from '../shows/shows-store'

interface EpisodesListProps {
  show: ShowModel
}

const EpisodesList = ({ show }: EpisodesListProps) => (
  <ul>
    {inSeasons(show.episodes).map((season) => (
      <li key={season.season} className="season">
        <h3>{season.season === 999 ? 'Specials' : `Season ${season.season}`}</h3>
        <Episodes
          show={show}
          episodes={season.episodes.sort(sortAscending)}
        />
      </li>
    ))}
  </ul>
)

export const Show = observer(() => {
  const { id } = useParams() as { id: string }
  const navigate = useNavigate()

  const show = showsStore.getShowById(id)

  useEffect(() => {
    sendStats('View All Episodes', {
      showId: id,
      showName: show?.displayName,
    })
  }, [true])

  if (!show) return null

  return (
    <Modal className="all-episodes">
      <ModalHeader onClose={() => navigate('/')}>
        <h2>{show.displayName}</h2>
      </ModalHeader>
      <ModalContent>
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
      </ModalContent>
    </Modal>
  )
})
