import React, { createClass } from 'react';
import { connect } from 'react-redux';
import { updatePath } from 'redux-simple-router';
import Modal from '../modal/modal';
import { updateShow, deleteShow } from '../data/actions';

const Edit = createClass({
  getInitialState () {
    return { confirmDeletion: false };
  },

  render () {
    const { show } = this.props;
    if (!show) { return <span></span>; }

    return (
      <div>
        <Modal onClose={this._close}>
          <form className="form show-edit" onSubmit={this._save}>
            <fieldset>
              <label>Display Name</label>
              <input ref="displayName" defaultValue={show.get('display_name')} />
            </fieldset>

            <fieldset>
              <label>Search Name</label>
              <input ref="searchName" defaultValue={show.get('search_name')} />
            </fieldset>

            <fieldset>
              <label>File Name</label>
              <input ref="fileName" defaultValue={show.get('file_name')} />
            </fieldset>

            <footer className="clearfix">
              <button type="submit">Save</button>
              <a onClick={this._askForConfirmation} href="#">Delete show</a>
            </footer>
          </form>
        </Modal>
        {this._confirmation(show)}
      </div>
    );
  },

  _askForConfirmation (e) {
    e.preventDefault();
    this.setState({ confirmDeletion: true });
  },

  _confirmation (show) {
    if (!this.state.confirmDeletion) { return null; }

    return (
      <Modal onOk={this._confirmDelete} onCancel={this._cancelDelete}>
        <p>Delete {show.get('display_name')}?</p>
      </Modal>
    );
  },

  _confirmDelete () {
    this.props.dispatch(deleteShow(this.props.show));
    this._close();
  },

  _cancelDelete () {
    this.setState({ confirmDeletion: false });
  },

  _save (e) {
    e.preventDefault();

    const show = this.props.show.merge({
      display_name: this.refs.displayName.value,
      search_name: this.refs.searchName.value,
      file_name: this.refs.fileName.value,
    });

    this.props.dispatch(updateShow(show));
    this._close();
  },

  _close () {
    this.props.dispatch(updatePath('/shows'));
  }
});

const stateToProps = ({ shows }, props) => {
  return {
    show: shows.items.find((show) => show.get('id') === props.params.id)
  };
};

export default connect(stateToProps)(Edit);