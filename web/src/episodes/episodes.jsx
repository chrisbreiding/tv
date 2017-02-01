import React from 'react';
import Episode from './episode';
import MoreLess from '../more-less/more-less';

export default ({ show, episodes, threshold }) => (
  <MoreLess threshold={threshold}>
    {
      episodes.map((episode) => {
        return <Episode key={episode.id} show={show} episode={episode} />;
      })
    }
  </MoreLess>
);
