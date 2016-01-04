import React, { createClass } from 'react';
import Episodes from '../episodes/episodes';
import Options from './show-options';

export default createClass({
  render () {
    const { show, viewLink } = this.props;
    return (
      <li key={show.get('id')}>
        <h3>
          <span>
            {show.get('display_name')}
            <Options id={show.get('id')} searchName={show.get('search_name')} viewLink={viewLink} />
          </span>
        </h3>
        <Episodes showFilename={show.get('file_name')} episodes={show.get('episodes')} threshold={3} />
      </li>
    );
  }
});
