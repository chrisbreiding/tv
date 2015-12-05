import cs from 'classnames';
import moment from 'moment';
import React, { createClass } from 'react';
import { shortEpisodeNumber, longEpisodeNumber, fileSafeTitle } from '../lib/episodes';
import date from '../lib/date';

export default createClass({
  render () {
    const { show, episode } = this.props;

    const airdate = moment(episode.get('airdate'));
    const className = cs({
      'episode-single': true,
       today: date.isToday(airdate),
       'far-past': date.isFarPast(airdate),
       past: date.isPast(airdate),
       recent: date.isRecent(airdate),
       upcoming: date.isUpcoming(airdate),
       future: date.isFuture(airdate),
       'far-future': date.isFarFuture(airdate)
    });
    
    return (
      <li className={className}>
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
