import { observer } from 'mobx-react';
import React from 'react';
import Episodes from '../episodes/episodes';
import Options from './show-options';

export default observer(({ show, type, searchLink }) => (
  <li key={show.id}>
    <h3>
      <span>
        {show.display_name}
        <Options id={show.id} searchName={show.search_name} searchLink={searchLink} />
      </span>
    </h3>
    <Episodes show={show} episodes={show[`${type}Episodes`]} threshold={3} />
  </li>
));
