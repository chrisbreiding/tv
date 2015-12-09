import React, { createClass } from 'react';
import { withEpisodes } from '../lib/shows';
import Show from './show';

export default createClass({
  shouldComponentUpdate (nextProps) {
    return nextProps.shows !== this.props.shows ||
      nextProps.episodes !== this.props.episodes ||
      nextProps.settings !== this.props.settings;
  },

  render () {
    const { label, type, episodes, settings } = this.props;
    const shows = withEpisodes(this.props.shows, episodes);

    return (
      <div className={`shows ${type}`}>
        <h2>{label}</h2>
        <ul>
          {
            this.props.filterShows(shows).map((show) => {
              return <Show
                       key={show.get('id')}
                       show={show}
                       settings={settings}
                       filterEpisodes={this.props.filterEpisodes} />;
            })
          }
        </ul>
      </div>
    );
  },
});
