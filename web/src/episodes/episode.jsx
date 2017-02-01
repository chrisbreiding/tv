import _ from 'lodash';
import cs from 'classnames';
import React, { Component } from 'react';
import date from '../lib/date';
import uiState from '../lib/ui-state';
import api from '../data/api';

export default class Episode extends Component {
  constructor (props) {
    super(props);

    this.state = { showingFileName: false };
  }

  componentDidMount () {
    if (uiState.desktopRunning) return

    this.handler = () => {
      if (this.state.showingFileName) {
        this.setState({ showingFileName: false });
      }
    };
    document.body.addEventListener('click', this.handler);
  }

  componentWillUnmount () {
    if (uiState.desktopRunning) return

    document.body.removeEventListener('click', this.handler);
  }

  render () {
    const { episode } = this.props;

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
          {this._fileName()}
        </span>
      </li>
    );
  }

  _fileName () {
    const { episode, show } = this.props;
    return `${show.file_name} - ${episode.longEpisodeNumber} - ${episode.fileSafeTitle}`
  }

  _showFileName = () => {
    if (uiState.desktopRunning) {
      const { episode, show } = this.props

      api.handleEpisode(_.extend(episode.serialize(), {
        fileName: this._fileName(),
        show: {
          displayName: show.display_name,
          searchName: show.search_name,
          fileName: show.file_name,
        },
      }))
      return
    }

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
