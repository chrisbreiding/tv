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
        <span className="title">
          <span onClick={this._showFileName}>{episode.title}</span>
          {this._options()}
        </span>
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
    this.setState({ showingFileName: true }, () => {
      let text = this.refs.fileName;
      let selection = window.getSelection();
      let range = document.createRange();

      range.selectNodeContents(text);
      selection.removeAllRanges();
      selection.addRange(range);
    });
  }

  _options () {
    if (!uiState.desktopRunning) return null

    return (
      <div className='options'>
        <ul>
          <li>
            <button title='Move episode' onClick={this._moveEpisode}>
              <i className='fa fa-random' />
            </button>
          </li>
          <li>
            <button title='Download episode' onClick={this._downloadEpisode}>
              <i className='fa fa-cloud-download' />
            </button>
          </li>
        </ul>
      </div>
    )
  }

  _moveEpisode = () => {
    api.moveEpisode(this._episodeDetails())
  }

  _downloadEpisode = () => {
    api.downloadEpisode(this._episodeDetails())
  }

  _episodeDetails () {
    const { episode, show } = this.props

    return _.extend(episode.serialize(), {
      fileName: this._fileName(),
      show: {
        displayName: show.display_name,
        searchName: show.search_name,
        fileName: show.file_name,
      },
    })
  }
}
