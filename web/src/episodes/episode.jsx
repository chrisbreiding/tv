import cs from 'classnames';
import React, { Component } from 'react';
import date from '../lib/date';

export default class Episode extends Component {
  constructor (props) {
    super(props);

    this.state = { showingFileName: false };
  }

  componentDidMount () {
    this.handler = () => {
      if (this.state.showingFileName) {
        this.setState({ showingFileName: false });
      }
    };
    document.body.addEventListener('click', this.handler);
  }

  componentWillUnmount () {
    document.body.removeEventListener('click', this.handler);
  }

  render () {
    const { showFilename, episode } = this.props;

    const airdate = episode.airdate;
    const className = cs({
      'episode-single': true,
      today: date.isToday(airdate),
      'far-past': date.isFarPast(airdate),
      past: date.isPast(airdate),
      recent: date.isRecent(airdate),
      upcoming: date.isUpcoming(airdate),
      future: date.isFuture(airdate),
      'far-future': date.isFarFuture(airdate),
      'show-file-name': this.state.showingFileName,
    });

    return (
      <li className={className}>
        <span className="episode-number">
          <span>{episode.shortEpisodeNumber}</span>
        </span>
        <span className="airdate">{date.shortString(episode.airdate)}</span>
        <span className="title" onClick={this._showFileName}>{episode.title}</span>
        <span className="file-name" ref="fileName">
          {showFilename} - {episode.longEpisodeNumber} - {episode.fileSafeTitle}
        </span>
      </li>
    );
  }

  _showFileName = () => {
    this.setState({ showingFileName: true }, () => {
      let text = this.refs.fileName;
      let selection = window.getSelection();
      let range = document.createRange();

      range.selectNodeContents(text);
      selection.removeAllRanges();
      selection.addRange(range);
    });
  }
}
