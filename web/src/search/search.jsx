import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Modal from '../modal/modal';
import { AutoFocusedInput } from '../lib/form';

@withRouter
@observer
export default class Search extends Component {
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
  }

  _search = (e) => {
    e.preventDefault();
    this.props.router.push(`/search/${this.refs.query.value}`);
  }

  _close = () => {
    this.props.router.push('/');
  }
}
