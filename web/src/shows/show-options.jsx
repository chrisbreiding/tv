import React from 'react';
import { Link } from 'react-router';

function viewLink (link, searchName) {
  return (link || '').replace('%s', searchName);
}

export default ({ show, settings }) => {
  return (
    <div className="options">
      <ul>
        <li>
          <Link to={`/shows/${show.get('id')}`} title="All Episodes">
            <i className="fa fa-list-ul"></i>
          </Link>
        </li>
        <li>
          <Link to={`/shows/${show.get('id')}/edit`} title="Edit">
            <i className="fa fa-edit"></i>
          </Link>
        </li>
        <li>
          <a href={viewLink(settings.get('view_link'), show.get('search_name'))} title="View" target="_blank">
            <i className="fa fa-eye"></i>
          </a>
        </li>
      </ul>
    </div>
  );
};
