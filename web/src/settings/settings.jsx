import { connect } from 'react-redux';
import React, { createClass } from 'react';
import Modal from '../modal/modal';
import date from '../lib/date';
import { updateSettings } from './actions';
import { AutoFocusedInput } from '../lib/form';
import { navigateHome } from '../lib/navigation';

const Settings = createClass({
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
  },

  _viewLinkInput () {
    const viewLink = this.props.settings.get('view_link');
    if (!viewLink) { return null; }
    return <AutoFocusedInput ref="viewLink" defaultValue={viewLink} />;
  },

  _controls () {
    return (
      <div className="controls">
        <p>Last updated: {date.longString(this.props.settings.get('last_updated'))}</p>
        <button type="submit" onClick={this._save}>Save</button>
      </div>
    );
  },

  _save (e) {
    e.preventDefault();
    this.props.dispatch(updateSettings(this.props.settings.merge({
      view_link: this.refs.viewLink.getValue()
    })));
    this._close();
  },

  _close () {
    this.props.dispatch(navigateHome());
  },
});

const stateToProps = ({ settings }) => {
  return { settings };
};

export default connect(stateToProps)(Settings);
