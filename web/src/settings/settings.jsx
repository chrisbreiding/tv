import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Modal from '../modal/modal';
import date from '../lib/date';
import { AutoFocusedInput } from '../lib/form';
import { updateSettings } from './settings-api'
import settingsStore from './settings-store';

@withRouter
@observer
export default class Settings extends Component {
  render () {
    return (
      <Modal className="settings" onClose={this._close} footerContent={this._controls()}>
        <form className="form" onSubmit={this._save}>
          <fieldset>
            <label>View Link</label>
            {this._viewLinkInput()}
          </fieldset>
        </form>
      </Modal>
    );
  }

  _viewLinkInput () {
    const viewLink = settingsStore.view_link;
    if (!viewLink) { return null; }
    return <AutoFocusedInput ref="viewLink" defaultValue={viewLink} />;
  }

  _controls () {
    return (
      <div className="controls">
        <p>Last updated: {date.longString(settingsStore.last_updated)}</p>
        <button type="submit" onClick={this._save}>Save</button>
      </div>
    );
  }

  _save = (e) => {
    e.preventDefault();
    updateSettings({
      view_link: this.refs.viewLink.value,
    });
    this._close();
  }

  _close = () => {
    this.props.router.push('/');
  }
}
