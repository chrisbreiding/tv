import Immutable from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import Modal from '../modal/modal';
import Episodes from '../episodes/episodes';
import { sortAscending } from '../episodes/util';
import { navigateHome } from '../lib/navigation';

function seasons (episodes) {
  return episodes.reduce((coll, episode) => {
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
  }, Immutable.List()).sortBy(season => season.get('season'));
}

const Show = function ({ show, dispatch }) {
  if (!show) { return <span></span>; }

  return (
    <Modal
      className="all-episodes"
      headerContent={<h2>{show.get('display_name')}</h2>}
      onClose={() => dispatch(navigateHome())}
    >
      <ul>
        <li>
          {
            seasons(show.get('episodes')).map((season) => {
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

const stateToProps = ({ shows }, props) => {
  return {
    show: shows.get('items').find((show) => show.get('id') === Number(props.params.id))
  };
};

export default connect(stateToProps)(Show);
