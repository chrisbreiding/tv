import React, { createClass } from 'react';
import { connect } from 'react-redux';
import { fetchShows } from '../data/actions';

const stateToProps = ({ shows }) => {
  return { shows };
}

const Shows = createClass({
  componentWillMount () {
    this.props.dispatch(fetchShows());
  },

  render () {
    const shows = this.props.shows.items;

    return (
      <div>
        { this.props.shows.isFetching ? <p>Loading shows...</p> : null }
        <ul>
          {
            shows.map((show) => {
              return <li key={show.id}>{show.display_name}</li>;
            })
          }
        </ul>
      </div>
    );
  },
});

export default connect(stateToProps)(Shows);
