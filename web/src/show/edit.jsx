import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Modal from '../modal/modal';
import { AutoFocusedInput, Input } from '../lib/form';
import { deleteShow, updateShow } from '../shows/shows-api';
import showsStore from '../shows/shows-store';

@withRouter
export default class EditShow extends Component {
  constructor (props) {
    super(props);

    this.state = { confirmDeletion: false };
  }

  render () {
    const show = this.show = showsStore.getShowById(Number(this.props.params.id));
    if (!show) return null;

    return (
      <div className="show-edit">
        <Modal onClose={this._close} footerContent={this._controls()}>
          <form className="form" onSubmit={this._save}>
            <fieldset>
              <label>Display Name</label>
              <AutoFocusedInput ref="displayName" defaultValue={show.display_name} />
            </fieldset>

            <fieldset>
              <label>Search Name</label>
              <Input ref="searchName" defaultValue={show.search_name} />
            </fieldset>

            <fieldset>
              <label>File Name</label>
              <Input ref="fileName" defaultValue={show.file_name} />
            </fieldset>

            <button className="hide">Hidden here so submit on enter works</button>
          </form>
        </Modal>
        {this._confirmation()}
      </div>
    );
  }

  _controls () {
    return (
      <div className="controls">
        <a onClick={this._askForConfirmation} href="#">Delete show</a>
        <button type="submit" onClick={this._save}>Save</button>
      </div>
    );
  }

  _askForConfirmation = (e) => {
    e.preventDefault();
    this.setState({ confirmDeletion: true });
  }

  _confirmation = () => {
    if (!this.state.confirmDeletion) return null;

    return (
      <Modal onOk={this._confirmDelete} onCancel={this._cancelDelete}>
        <p>Delete {this.show.display_name}?</p>
      </Modal>
    );
  }

  _confirmDelete = () => {
    deleteShow(this.show);
    this._close();
  }

  _cancelDelete = () => {
    this.setState({ confirmDeletion: false });
  }

  _save = (e) => {
    e.preventDefault();

    updateShow({
      id: this.show.id,
      display_name: this.refs.displayName.value,
      search_name: this.refs.searchName.value,
      file_name: this.refs.fileName.value,
    });
    this._close();
  }

  _close = () => {
    this.props.router.push('/');
  }
}
