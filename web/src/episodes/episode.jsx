import React, { createClass } from 'react';
import { shortEpisodeNumber, longEpisodeNumber, fileSafeTitle } from '../lib/episodes';
import date from '../lib/date';

export default createClass({
  render () {
    const { show, episode } = this.props;

    return (
      <li className="episode-single">
        <span className="episode-number">
          <span>{shortEpisodeNumber(episode)}</span>
        </span>
        <span className="airdate">{date.shortString(episode.get('airdate'))}</span>
        <span className="title">{episode.get('title')}</span>
        <span className="file-name">
          {show.get('file_name')} - {longEpisodeNumber(episode)} - {fileSafeTitle(episode)}
        </span>
      </li>
    );
  }
});
