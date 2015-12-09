import cs from 'classnames';
import React from 'react';
import date from '../lib/date';

export default ({ show, onAddShow }) => {
  return (
    <li>
      <button title="Add Show" onClick={onAddShow}>
        <i className="fa fa-plus"></i>
      </button>
      <div>
        <h4>{show.get('name')}</h4>
        <dl>
          <dt className={cs({ 'no-value': !show.get('first_aired') })}>First Aired</dt>
          <dd>{date.shortString(show.get('first_aired'))}</dd>

          <dt className={cs({ 'no-value': !show.get('network') })}>Network</dt>
          <dd>{show.get('network')}</dd>

          <dt className={cs({ 'no-value': !show.get('description') })}>Description</dt>
          <dd>{show.get('description')}</dd>
        </dl>
      </div>
    </li>
  );
};
