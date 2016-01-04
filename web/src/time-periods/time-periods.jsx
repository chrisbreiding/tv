import React, { createClass } from 'react';
import { connect } from 'react-redux';
import { fetchShows } from '../shows/actions';
import { fetchSettings } from '../settings/actions';
import Shows from '../shows/shows';
import { pluckState } from '../data/util';
import Loader from '../loader/loader';

const TimePeriods = createClass({
  componentWillMount () {
    this.props.dispatch(fetchShows());
    this.props.dispatch(fetchSettings());
  },

  render () {
    const { shows, settings, children } = this.props;

    if (shows.get('isFetching')) {
      return <p className="full-screen-centered">
       <Loader>Loading shows...</Loader>
      </p>;
    } else {
      return (
        <div>
          <Shows
            type="recent"
            label="Recent"
            shows={shows.get('recent')}
            settings={settings}
          />
          <Shows
            type="upcoming"
            label="Upcoming"
            shows={shows.get('upcoming')}
            settings={settings}
          />
          <Shows
            type="off-air"
            label="Off Air"
            shows={shows.get('offAir')}
            settings={settings}
          />
          {children}
        </div>
      );
    }
  },
});

export default connect(pluckState('shows', 'settings'))(TimePeriods);
