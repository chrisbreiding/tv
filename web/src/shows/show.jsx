import React, { createClass } from 'react';
import Episodes from '../episodes/episodes';

export default createClass({
  render () {
    const { show } = this.props;
    return (
      <li key={show.get('id')}>
        <h3>{show.get('display_name')}</h3>
        <Episodes show={show} episodes={this.props.episodesFilter(show.get('episodes'))} />
      </li>
    );
  }
});
