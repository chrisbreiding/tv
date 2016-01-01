import React, { createClass } from 'react';
import { withEpisodes } from '../shows/util';
import Show from './show';

export default createClass({
  shouldComponentUpdate (nextProps) {
    return nextProps.shows !== this.props.shows ||
      nextProps.settings !== this.props.settings;
  },

  render () {
    const { label, type, shows, settings } = this.props;
    if (!shows.size || !settings.size) {
      return null;
    }

    return (
      <div className={`shows ${type}`}>
        <h2>{label}</h2>
        <ul>{shows.map(this._show)}</ul>
      </div>
    );
  },

  _show (show) {
    return <Show
             key={show.get('id')}
             show={show}
             settings={this.props.settings}
             filterEpisodes={this.props.filterEpisodes} />;
  },
});
