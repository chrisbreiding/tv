import cs from 'classnames';
import React from 'react';
import date from '../lib/date';

export default ({ exists, show, onAddShow }) => {
  return (
    <li className={cs({ exists })}>
      <button title="Add Show" onClick={onAddShow} disabled={exists}>
        <i className="fa fa-plus"></i>
      </button>
      <div>
        {exists ? <p>Show already added</p> : null}
        <img src={show.get('banner')} />
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
