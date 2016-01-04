import React, { createClass } from 'react';
import Episode from './episode';
import MoreLess from '../more-less/more-less';

export default createClass({
  render () {
    const { showFilename, episodes, threshold } = this.props;

    return (
      <MoreLess threshold={threshold}>
        {
          episodes.map((episode) => {
            return <Episode key={episode.get('id')} showFilename={showFilename} episode={episode} />;
          })
        }
      </MoreLess>
    );
  }
});
