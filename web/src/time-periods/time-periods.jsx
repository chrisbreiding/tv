import React, { createClass } from 'react';
import { connect } from 'react-redux';
import { fetchShows } from '../shows/actions';
import { fetchSettings } from '../settings/actions';
import Shows from '../shows/shows';
import { recentShows, upcomingShows, offAirShows } from '../lib/shows';
import { recentEpisodes, upcomingEpisodes, offAirEpisodes } from '../lib/episodes';
import Loader from '../loader/loader';

const TimePeriods = createClass({
  componentWillMount () {
    this.props.dispatch(fetchShows());
    this.props.dispatch(fetchSettings());
  },

  render () {
    if (this.props.shows.get('isFetching')) {
      return <p className="loading-shows">
       <Loader>Loading shows...</Loader>
      </p>;
    } else {
      return (
        <div>
          <Shows
            type="recent"
            label="Recent"
            shows={this.props.shows.get('items')}
            filterShows={recentShows}
            episodes={this.props.episodes}
            filterEpisodes={recentEpisodes}
            settings={this.props.settings}
          />
          <Shows
            type="upcoming"
            label="Upcoming"
            shows={this.props.shows.get('items')}
            filterShows={upcomingShows}
            episodes={this.props.episodes}
            filterEpisodes={upcomingEpisodes}
            settings={this.props.settings}
          />
          <Shows
            type="off-air"
            label="Off Air"
            shows={this.props.shows.get('items')}
            filterShows={offAirShows}
            episodes={this.props.episodes}
            filterEpisodes={offAirEpisodes}
            settings={this.props.settings}
          />
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
