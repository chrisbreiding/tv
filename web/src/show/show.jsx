import cs from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { withRouter } from 'react-router'

import stats from '../lib/stats'
import Loader from '../loader/loader'
import Modal from '../modal/modal'
import Episodes from '../episodes/episodes'
import { inSeasons, sortAscending } from '../episodes/util'
import showsStore from '../shows/shows-store'

const content = (show, seasons) => {
  if (showsStore.isLoadingFromApi) {
    return <Loader>Loading episodes...</Loader>
  }

  return (
    <ul>
      {
        _.map(seasons, (season) => {
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
}

class Show extends Component {
  componentWillMount () {
    const show = showsStore.getShowById(this.props.params.id)
    stats.send('View All Episodes', {
      showId: show.id,
      showName: show.displayName,
    })
  }

  render () {
    const { params, router } = this.props
    const show = showsStore.getShowById(params.id)
    if (!show) return null

    const seasons = inSeasons(show.episodes)

    return (
      <Modal className="all-episodes">
        <Modal.Header onClose={() => router.push('/')}>
          <h2>{show.displayName}</h2>
        </Modal.Header>
        <Modal.Content>
          <dl>
            <dt className={cs({ 'no-value': !show.network })}>Network:</dt>
            <dd>{show.network}</dd>

            <dt className={cs({ 'no-value': !show.status })}>Status:</dt>
            <dd>{show.status}</dd>
          </dl>
          {content(show, seasons)}
        </Modal.Content>
      </Modal>
    )
  }
}

export default withRouter(observer(Show))
