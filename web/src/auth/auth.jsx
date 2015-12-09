import React, { createClass } from 'react';
import { connect } from 'react-redux';
import { updatePath } from 'redux-simple-router';
import { getApiKey, setApiKey } from '../data/api';
import { AutoFocusedInput } from '../lib/form';

const Auth = createClass({
  render () {
    return (
      <div className="auth">
        <form className="form" onSubmit={this._submit}>
          <p>Your API key is missing or invalid. Please authenticate.</p>

          <fieldset>
            <label>API Key</label>
            <AutoFocusedInput
              ref="apiKey"
              defaultValue={getApiKey()}
            />
          </fieldset>

          <footer className="clearfix">
            <button type="submit">Authenticate</button>
          </footer>
        </form>
      </div>
    );
  },

  _submit (e) {
    e.preventDefault();
    setApiKey(this.refs.apiKey.getValue());
    this.props.dispatch(updatePath('/shows'));
  }
});

export default connect()(Auth);
