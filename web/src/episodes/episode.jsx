import { faMagnifyingGlass, faShuffle, faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import _ from 'lodash'
import cs from 'classnames'
import React, { Component } from 'react'
import Tooltip from '@cypress/react-tooltip'

import date from '../lib/date'
import uiState from '../lib/ui-state'
import util from '../lib/util'
import api from '../data/api'
import settingsStore from '../settings/settings-store'

export default class Episode extends Component {
  constructor (props) {
    super(props)

    this.state = { showingFileName: false }
  }

  componentDidMount () {
    this.handler = () => {
      if (this.state.showingFileName) {
        this.setState({ showingFileName: false })
      }
    }
    document.body.addEventListener('click', this.handler)
  }

  componentWillUnmount () {
    document.body.removeEventListener('click', this.handler)
  }

  render () {
    const { episode } = this.props

    const airdate = episode.airdate
    const className = cs({
      'episode-single': true,
      yesterday: date.isYesterday(airdate),
      today: date.isToday(airdate),
      'far-past': date.isFarPast(airdate),
      past: date.isPast(airdate),
      recent: date.isRecent(airdate),
      upcoming: date.isUpcoming(airdate),
      future: date.isFuture(airdate),
      'far-future': date.isFarFuture(airdate),
      'show-file-name': this.state.showingFileName,
    })

    return (
      <li className={className}>
        <span className="episode-number">
          <span>{episode.shortEpisodeNumber}</span>
        </span>
        <span className="airdate">{date.shortString(episode.airdate)}</span>
        <span className="title">
          <Tooltip className="episode-tooltip options-tooltip tooltip" placement="right" title={this._options()}>
            <span onClick={this._showFileName}>{episode.title || 'TBA'}</span>
          </Tooltip>
        </span>
        <span className="file-name" ref="fileName">
          {this._fileName()}
        </span>
      </li>
    )
  }

  _fileName () {
    const { episode, show } = this.props
    return `${show.fileName} - ${episode.longEpisodeNumber} - ${episode.fileSafeTitle}`
  }

  _showFileName = () => {
    this.setState({ showingFileName: true }, () => {
      let text = this.refs.fileName
      let selection = window.getSelection()
      let range = document.createRange()

      range.selectNodeContents(text)
      selection.removeAllRanges()
      selection.addRange(range)
    })
  }

  _options () {
    const { episode, show } = this.props
    const epNum = `s${util.pad(episode.season)}e${util.pad(episode.number)}`

    return (
      <div className='options'>
        <ul>
          {_.map(settingsStore.searchLinks, (link) => (
            <li key={link.name}>
              <a
                href={`${util.searchLink(link.episodeLink, show.searchName, epNum)}`}
                title={`Search ${link.name}`}
                target="_blank" rel="noreferrer"
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </a>
            </li>
          ))}
          {uiState.desktopRunning &&
            <li>
              <button title='Move' onClick={this._moveEpisode}>
                <FontAwesomeIcon icon={faShuffle} />
              </button>
            </li>
          }
          {uiState.desktopRunning &&
            <li>
              <button title='Download' onClick={this._downloadEpisode}>
                <FontAwesomeIcon icon={faDownload} />
              </button>
            </li>
          }
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

    return {
      id: episode.id,
      season: episode.season,
      number: episode.number,
      title: episode.title,
      airdate: episode.airdate.toISOString(),
      fileName: this._fileName(),
      show: {
        displayName: show.displayName,
        searchName: show.searchName,
        fileName: show.fileName,
      },
    }
  }
}
