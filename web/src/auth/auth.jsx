import React, { createClass } from 'react';
import { connect } from 'react-redux';
import cache from '../data/cache';
import { getApiKey, setApiKey } from '../data/api';
import { AutoFocusedInput } from '../lib/form';
import { navigateHome } from '../lib/navigation';

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
    cache.clear().then(() => {
      this.props.dispatch(navigateHome());
    });
  }
});

export default connect()(Auth);
