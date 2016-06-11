import _ from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import { withRouter } from 'react-router';

import Modal from '../modal/modal';
import Episodes from '../episodes/episodes';
import { inSeasons, sortAscending } from '../episodes/util';
import showsStore from '../shows/shows-store';

export default withRouter(observer(function Show ({ params, router }) {
  const show = showsStore.getShowById(Number(params.id));
  if (!show) return null;

  const seasons = inSeasons(show.episodes);

  return (
    <Modal
      className="all-episodes"
      headerContent={<h2>{show.display_name}</h2>}
      onClose={() => router.push('/')}
    >
      <ul>
        {
          _.map(seasons, (season) => {
            return (
              <li key={season.season} className="season">
                <h3>Season {season.season}</h3>
                <Episodes
                  showFilename={show.file_name}
                  episodes={_(season.episodes).sort(sortAscending).value()}
                />
              </li>
            );
          })
        }
      </ul>
    </Modal>
  );
}));
