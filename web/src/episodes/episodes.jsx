import React from 'react';
import Episode from './episode';
import MoreLess from '../more-less/more-less';

export default ({ showFilename, episodes, threshold }) => (
  <MoreLess threshold={threshold}>
    {
      episodes.map((episode) => {
        return <Episode key={episode.id} showFilename={showFilename} episode={episode} />;
      })
    }
  </MoreLess>
);
