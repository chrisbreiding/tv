import React, { createClass } from 'react';
import { connect } from 'react-redux';
import { fetchShows } from '../shows/actions';
import { fetchSettings } from '../settings/actions';
import Shows from '../shows/shows';
import { recentShows, upcomingShows, offAirShows } from '../shows/util';
import { pluckState } from '../data/util';
import { recentEpisodes, upcomingEpisodes, offAirEpisodes } from '../episodes/util';
import Loader from '../loader/loader';

const TimePeriods = createClass({
  componentWillMount () {
    this.props.dispatch(fetchShows());
    this.props.dispatch(fetchSettings());
  },

  render () {
    const shows = this.props.shows.get('items');

    if (this.props.shows.get('isFetching')) {
      return <p className="full-screen-centered">
       <Loader>Loading shows...</Loader>
      </p>;
    } else {
      return (
        <div>
          <Shows
            type="recent"
            label="Recent"
            shows={recentShows(shows)}
            filterEpisodes={recentEpisodes}
            settings={this.props.settings}
          />
          <Shows
            type="upcoming"
            label="Upcoming"
            shows={upcomingShows(shows)}
            filterEpisodes={upcomingEpisodes}
            settings={this.props.settings}
          />
          <Shows
            type="off-air"
            label="Off Air"
            shows={offAirShows(shows)}
            filterEpisodes={offAirEpisodes}
            settings={this.props.settings}
          />
          {this.props.children}
        </div>
      );
    }
  },
});

export default connect(pluckState('shows', 'settings'))(TimePeriods);
