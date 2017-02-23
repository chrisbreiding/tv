import { observer } from 'mobx-react';
import cs from 'classnames';
import React from 'react';

import date from '../lib/date';

export default observer(({ exists, show, onAddShow }) => {
  return (
    <li className={cs({ exists })}>
      <button title="Add Show" onClick={onAddShow} disabled={exists}>
        <i className="fa fa-plus"></i>
      </button>
      <div>
        {exists ? <p>Show already added</p> : null}
        <img src={show.banner} />
        <h4>{show.name}</h4>
        <dl>
          <dt className={cs({ 'no-value': !show.firstAired })}>First Aired</dt>
          <dd>{date.shortString(show.firstAired)}</dd>

          <dt className={cs({ 'no-value': !show.network })}>Network</dt>
          <dd>{show.network}</dd>

          <dt className={cs({ 'no-value': !show.description })}>Description</dt>
          <dd>{show.description}</dd>
        </dl>
      </div>
    </li>
  );
});
