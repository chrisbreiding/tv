import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router'

function makeViewLink (link, searchName) {
  return link
    .replace(/%s/g, searchName)
    .replace(/\[searchName]/g, searchName)
}

export default observer(({ id, searchName, viewLink }) => {
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
        {_.map((viewLink || '').split(','), (link) => (
          <li key={link}>
            <a href={makeViewLink(link, searchName)} title="View" target="_blank">
              <i className="fa fa-eye"></i>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
})
