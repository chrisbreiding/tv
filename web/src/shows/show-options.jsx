import { faListUl, faMagnifyingGlass, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router'

import stats from '../lib/stats'
import util from '../lib/util'

export default observer(({ id, searchName, searchLinks }) => {
  const trackGoToSearch = (link) => () => {
    stats.send('Go To Search Link', {
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
        {_.map(searchLinks, (link) => (
          <li key={link.name}>
            <a
              href={util.searchLink(link.showLink, searchName)}
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
