import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router'

import util from '../lib/util'

export default observer(({ id, searchName, searchLink }) => {
  return (
    <div className="options">
      <ul>
        <li>
          <Link to={`/shows/${id}`} title="All Episodes">
            <i className="fa fa-list-ul"></i>
          </Link>
        </li>
        <li>
          <Link to={`/shows/${id}/edit`} title="Edit">
            <i className="fa fa-edit"></i>
          </Link>
        </li>
        {_.map((searchLink || '').split(','), (link) => (
          <li key={link}>
            <a href={util.searchLink(link, searchName)} title="Search" target="_blank">
              <i className="fa fa-search"></i>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
})
