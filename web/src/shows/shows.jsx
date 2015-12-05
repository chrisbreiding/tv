import React, { createClass } from 'react';
import { connect } from 'react-redux';
import { fetchShows } from '../data/actions';
import ShowsList from './shows-list';
import { withEpisodes, recentShows, upcomingShows, offAirShows } from '../lib/shows';

const Shows = createClass({
  componentWillMount () {
    this.props.dispatch(fetchShows());
  },

  render () {
    const shows = withEpisodes(this.props.shows.items, this.props.episodes);

    if (this.props.shows.isFetching) {
      return <p>Loading shows...</p>;
    } else {
      return (
        <div>
          <ShowsList type="Recent" shows={recentShows(shows)} />
          <ShowsList type="Upcoming" shows={upcomingShows(shows)} />
          <ShowsList type="Off Air" shows={offAirShows(shows)} />
        </div>
      );
    }
  },
});

function stateToProps ({ shows, episodes }) {
  return { shows, episodes };
}

export default connect(stateToProps)(Shows);
