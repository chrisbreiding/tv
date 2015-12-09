import React, { createClass } from 'react';
import Episodes from '../episodes/episodes';
import Options from './show-options';

export default createClass({
  render () {
    const { show, settings } = this.props;
    return (
      <li key={show.get('id')}>
        <h3>
          <span>
            {show.get('display_name')}
            <Options show={show} settings={settings} />
          </span>
        </h3>
        <Episodes show={show} episodes={this.props.filterEpisodes(show.get('episodes'))} />
      </li>
    );
  }
});
