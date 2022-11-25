import { faListUl, faMagnifyingGlass, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router-dom'

import { sendStats } from '../data/remote'
import type { SearchLink } from '../lib/types'
import { searchLink } from '../lib/util'

interface ShowOptionsProps {
  id: string
  searchName: string
  searchLinks: SearchLink[]
}

export const ShowOptions = observer(({ id, searchName, searchLinks }: ShowOptionsProps) => {
  const trackGoToSearch = (link: string) => () => {
    sendStats('Go To Search Link', {
      showId: id,
      showName: searchName,
      searchLink: link,
    })
  }

  return (
    <div className="options">
      <ul>
        <li>
          <Link to={`/shows/${id}`} title="All Episodes">
            <FontAwesomeIcon icon={faListUl} />
          </Link>
        </li>
        <li>
          <Link to={`/shows/${id}/edit`} title="Edit">
            <FontAwesomeIcon icon={faPenToSquare} />
          </Link>
        </li>
        {searchLinks.map((link) => (
          <li key={link.name}>
            <a
              href={searchLink(link.showLink, searchName)}
              onClick={trackGoToSearch(link.showLink)}
              title={`Search ${link.name}`}
              target="_blank" rel="noreferrer"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
})
