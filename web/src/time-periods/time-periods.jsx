import React, { createClass } from 'react';
import { connect } from 'react-redux';
import { fetchShows } from '../data/actions';
import Shows from '../shows/shows';
import { withEpisodes, recentShows, upcomingShows, offAirShows } from '../lib/shows';
import { recentEpisodes, upcomingEpisodes, offAirEpisodes } from '../lib/episodes';

const TimePeriods = createClass({
  componentWillMount () {
    this.props.dispatch(fetchShows());
  },

  render () {
    const shows = withEpisodes(this.props.shows.items, this.props.episodes);

    if (this.props.shows.isFetching) {
      return <p>Loading ...</p>;
    } else {
      return (
        <div>
          <Shows type="Recent" shows={recentShows(shows)} episodesFilter={recentEpisodes} />
          <Shows type="Upcoming" shows={upcomingShows(shows)} episodesFilter={upcomingEpisodes} />
          <Shows type="Off Air" shows={offAirShows(shows)} episodesFilter={offAirEpisodes} />
          {this.props.children}
        </div>
      );
    }
  },
});

function stateToProps ({ shows, episodes }) {
  return { shows, episodes };
}

export default connect(stateToProps)(TimePeriods);
