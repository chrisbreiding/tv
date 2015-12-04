import React, { createClass } from 'react';
import { connect } from 'react-redux';
import { updatePath } from 'redux-simple-router';
import { getApiKey, setApiKey } from '../data/api';

const Auth = createClass({
  componentDidMount () {
    this.apiKeyInput.focus();
  },

  render () {
    return (
      <div className="auth">
        <form className="form" onSubmit={this._submit}>
          <p>Your API key is missing or invalid. Please authenticate.</p>

          <fieldset>
            <label>API Key</label>
            <input
              ref={(node) => this.apiKeyInput = node }
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
    setApiKey(this.apiKeyInput.value);
    this.props.dispatch(updatePath('/'));
  }
});

export default connect()(Auth);
