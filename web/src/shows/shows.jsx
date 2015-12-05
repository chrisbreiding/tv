import React, { createClass } from 'react';
import { connect } from 'react-redux';
import { fetchShows } from '../data/actions';
import ShowsList from './shows-list';

function recentShows (shows) {
  return shows;
}

function upcomingShows (shows) {
  return shows;
}

function offAirShows (shows) {
  return shows;
}

const Shows = createClass({
  componentWillMount () {
    this.props.dispatch(fetchShows());
  },

  render () {
    const shows = this.props.shows.items;

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

function stateToProps ({ shows }) {
  return { shows };
}

export default connect(stateToProps)(Shows);
