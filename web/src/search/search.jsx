import { connect } from 'react-redux';
import React, { createClass } from 'react';
import { updatePath } from 'redux-simple-router';
import Modal from '../modal/modal';
import { AutoFocusedInput } from '../lib/form';

const Search = createClass({
  render () {
    return (
      <Modal className="search" onClose={this._close}>
        <form onSubmit={this._search}>
          <h3>Search Shows</h3>

          <AutoFocusedInput ref="query" defaultValue={this.props.params.query} />
          <button type="submit">Search</button>
        </form>
        {this.props.children}
      </Modal>
    );
  },

  _search (e) {
    e.preventDefault();
    this.props.dispatch(updatePath(`/search/${this.refs.query.value}`));
  },

  _close () {
    this.props.dispatch(updatePath('/shows'));
  },
});

export default connect()(Search);
