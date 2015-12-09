import React, { createClass } from 'react';
import { connect } from 'react-redux';
import { fetchShows, fetchSettings } from '../data/actions';
import Shows from '../shows/shows';
import { withEpisodes, recentShows, upcomingShows, offAirShows } from '../lib/shows';
import { recentEpisodes, upcomingEpisodes, offAirEpisodes } from '../lib/episodes';
import Loader from '../loader/loader';

const TimePeriods = createClass({
  childContextTypes: {
    settings: React.PropTypes.any
  },

  getChildContext () {
    return { settings: this.props.settings };
  },

  componentWillMount () {
    this.props.dispatch(fetchShows());
    this.props.dispatch(fetchSettings());
  },

  render () {
    const shows = withEpisodes(this.props.shows.items, this.props.episodes);

    if (this.props.shows.isFetching) {
      return <p className="loading-shows">
       <Loader>Loading shows...</Loader>
      </p>;
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

function stateToProps ({ shows, episodes, settings }) {
  return { shows, episodes, settings };
}

export default connect(stateToProps)(TimePeriods);
