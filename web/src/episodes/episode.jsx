import cs from 'classnames';
import moment from 'moment';
import React, { createClass } from 'react';
import { shortEpisodeNumber, longEpisodeNumber, fileSafeTitle } from '../lib/episodes';
import date from '../lib/date';

export default createClass({
  getInitialState () {
    return { showingFileName: false };
  },

  componentDidMount: function () {
    this.handler = () => {
      if (this.isMounted()) {
        this.setState({ showingFileName: false });
      }
    };
    document.body.addEventListener('click', this.handler);
  },

  componentWillUnmount () {
    document.body.removeEventListener('click', this.handler);
  },

  render () {
    const { show, episode } = this.props;

    const airdate = episode.get('airdate');
    const className = cs({
      'episode-single': true,
       today: date.isToday(airdate),
       'far-past': date.isFarPast(airdate),
       past: date.isPast(airdate),
       recent: date.isRecent(airdate),
       upcoming: date.isUpcoming(airdate),
       future: date.isFuture(airdate),
       'far-future': date.isFarFuture(airdate),
       'show-file-name': this.state.showingFileName
    });

    return (
      <li className={className}>
        <span className="episode-number">
          <span>{shortEpisodeNumber(episode)}</span>
        </span>
        <span className="airdate">{date.shortString(episode.get('airdate'))}</span>
        <span className="title" onClick={this._showFileName}>{episode.get('title')}</span>
        <span className="file-name" ref="fileName">
          {show.get('file_name')} - {longEpisodeNumber(episode)} - {fileSafeTitle(episode)}
        </span>
      </li>
    );
  },

  _showFileName () {
    this.setState({ showingFileName: true }, () => {
      let text = this.refs.fileName;
      let selection = window.getSelection();
      let range = document.createRange();

      range.selectNodeContents(text);
      selection.removeAllRanges();
      selection.addRange(range);
    });
  },
});
