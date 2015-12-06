import Immutable from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import { updatePath } from 'redux-simple-router';
import Modal from '../modal/modal';
import Episodes from '../episodes/episodes';
import { sortAscending } from '../lib/episodes';

function seasons (episodeIds, episodes) {
  return episodeIds.reduce(function (coll, episodeId) {
    const episode = episodes.get(episodeId);
    const seasonNumber = episode.get('season');
    const existingSeason = coll.findEntry((season) => season.get('season') === seasonNumber);
    if (existingSeason) {
      const [index, season] = existingSeason;
      return coll.set(index, season.set('episodes', season.get('episodes').push(episode)));
    } else {
      return coll.push(Immutable.Map({
        season: seasonNumber,
        episodes: Immutable.List([episode])
      }));
    }
  }, Immutable.List());
}

const Show = function ({ show, episodes, dispatch }) {
  if (!show || !episodes) { return <span></span>; }

  return (
    <Modal className="all-episodes" onClose={() => dispatch(updatePath('/shows'))}>
      <h2>{show.get('display_name')}</h2>
      <ul>
        <li>
          {
            seasons(show.get('episodes'), episodes).map((season) => {
              return (
                <div key={season.get('season')}>
                  <h3>Season {season.get('season')}</h3>
                  <Episodes show={show} episodes={season.get('episodes').sort(sortAscending)} />
                </div>
              );
            })
          }
        </li>
      </ul>
    </Modal>
  );
};

const stateToProps = ({ shows, episodes }, props) => {
  return {
    show: shows.items.find((show) => show.get('id') === props.params.id),
    episodes
  };
};

export default connect(stateToProps)(Show);
