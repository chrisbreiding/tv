import React, { createClass } from 'react';
import Episodes from '../episodes/episodes';
import Options from './show-options';

export default createClass({
  render () {
    const { show } = this.props;
    return (
      <li key={show.get('id')}>
        <h3>
          <span>
            {show.get('display_name')}
            <Options show={show} />
          </span>
        </h3>
        <Episodes show={show} episodes={this.props.episodesFilter(show.get('episodes'))} />
      </li>
    );
  }
});
