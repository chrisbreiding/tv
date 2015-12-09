import { connect } from 'react-redux';
import React, { createClass } from 'react';
import { updatePath } from 'redux-simple-router';
import { searchSourceShows, addShow } from '../data/actions';
import Result from './result';
import Loader from '../loader/loader';

const Results = createClass({
  componentDidMount () {
    this._search();
  },

  componentDidUpdate (prevProps) {
     if (this.props.params.query !== prevProps.params.query) {
      this._search();
    }
  },

  _search () {
    if (this.props.params.query) {
      this.props.dispatch(searchSourceShows(this.props.params.query));
    }
  },

  render () {
    const sourceShows = this.props.sourceShows.get('items');

    if (this.props.sourceShows.get('isFetching')) {
      return <p className="no-results">
        <Loader>Searching...</Loader>
      </p>;
    } else if (this.props.params.query == null) {
      return null;
    } else if (sourceShows.isEmpty()) {
      return <p className="no-results">No shows found</p>;
    }

    return (
      <ul className="results">
        {sourceShows.map((show) => {
          return (
            <Result
              key={show.get('id')}
              show={show}
              onAddShow={this._addShow(show)}
            />
          );
        })}
      </ul>
    );
  },

  _addShow (show) {
    return () => {
      const name = show.get('name');
      this.props.dispatch(addShow({
        display_name: name,
        search_name: name,
        file_name: name,
        source_id: show.get('id')
      }));
      this.props.dispatch(updatePath('/shows'));
    };
  }
});

const stateToProps = ({ sourceShows }) => {
  return { sourceShows };
};

export default connect(stateToProps)(Results);
