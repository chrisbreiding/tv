import React, { createClass } from 'react';
import Episode from './episode';

export default createClass({
  render () {
    const { show, episodes } = this.props;

    return (
      <ul className="episodes-list">
        {
          episodes.map((episode) => {
            return <Episode key={episode.get('id')} show={show} episode={episode} />;
          })
        }
      </ul>
    );
  }
});
