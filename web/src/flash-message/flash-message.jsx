import React, { createClass } from 'react';

export default createClass({
  render () {
    const message = this._message();
    if (!message) { return null; }

    return (
      <div className="flash-message">
        <p>
          <i className="fa fa-clock-o"></i>
          {message}
        </p>
      </div>
    );
  },

  _message () {
    let show;
    if (show = this.props.shows.get('addingShow')) {
      return this._showMessage('Adding', show);
    } else if (show = this.props.shows.get('deletingShow')) {
      return this._showMessage('Deleting', show);
    }
    return null;
  },

  _showMessage (prefix, show) {
    return show && <span>{prefix} <em>{show}</em>...</span>;
  },
});
