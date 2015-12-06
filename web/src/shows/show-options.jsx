import React from 'react';
import { Link } from 'react-router';

export default function ({ show }) {
  return (
    <div className="options">
      <ul>
        <li>
          <Link to={`/shows/${show.get('id')}`} title="All Episodes">
            <i className="fa fa-list-ul"></i>
          </Link>
        </li>
        <li>
          <Link to={`/`} title="Edit">
            <i className="fa fa-edit"></i>
          </Link>
        </li>
        <li>
          <a href="/" title="View" target="_blank">
            <i className="fa fa-eye"></i>
          </a>
        </li>
      </ul>
    </div>
  );
}
