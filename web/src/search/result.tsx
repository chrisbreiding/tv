import { faCheckSquare, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import cs from 'classnames'
import React from 'react'

import { shortString } from '../lib/date'
import type { SearchResultShowModel } from './search-result-show-model'

interface ResultProps {
  exists: boolean
  show: SearchResultShowModel
  onAddShow: (e: any) => void
}

export const Result = observer(({ exists, show, onAddShow }: ResultProps) => {
  return (
    <li className={cs({ exists })}>
      <img src={show.poster} />
      <article>
        {exists ? <p><FontAwesomeIcon icon={faCheckSquare} /> Show already added</p> : null}
        <h4>{show.name}</h4>
        <dl>
          <dt className={cs({ 'no-value': !show.firstAired })}>First Aired</dt>
          <dd>{shortString(show.firstAired)}</dd>

          <dt className={cs({ 'no-value': !show.network })}>Network</dt>
          <dd>{show.network}</dd>

          <dt className={cs({ 'no-value': !show.description })}>Description</dt>
          <dd>{show.description}</dd>

          <dt className={cs({ 'no-value': !show.status })}>Status</dt>
          <dd>{show.status}</dd>
        </dl>
      </article>
      <div className="spacer" />
      <button title="Add Show" onClick={onAddShow} disabled={exists}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </li>
  )
})
