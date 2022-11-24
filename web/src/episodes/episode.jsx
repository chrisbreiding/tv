import Tooltip from '@cypress/react-tooltip'
import {
  faMagnifyingGlass,
  faShuffle,
  faDownload,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cs from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react'
import React, { useEffect, useRef, useState } from 'react'

import date from '../lib/date'
import uiState from '../lib/ui-state'
import { eventBus, searchLink } from '../lib/util'
import api from '../data/api'
import settingsStore from '../settings/settings-store'

const moveEpisode = (episodeDetails) => {
  api.moveEpisode(episodeDetails)
}

const downloadEpisode = (episodeDetails) => {
  api.downloadEpisode(episodeDetails)
}

const getFileName = ({ episode, show }) => {
  return `${show.fileName} - ${episode.longEpisodeNumber} - ${episode.fileSafeTitle}`
}

const getEpisodeDetails = ({ episode, show }) => {
  return {
    id: episode.id,
    season: episode.season,
    number: episode.number,
    title: episode.title,
    airdate: episode.airdate.toISOString(),
    fileName: getFileName({ episode, show }),
    show: {
      displayName: show.displayName,
      searchName: show.searchName,
      fileName: show.fileName,
    },
  }
}

const Options = observer(({ episode, show }) => (
  <div className='options'>
    <ul>
      {_.map(settingsStore.searchLinks, (link) => (
        <li key={link.name}>
          <a
            href={`${searchLink(link.episodeLink, show.searchName, episode.longEpisodeNumber)}`}
            title={`Search ${link.name}`}
            target="_blank" rel="noreferrer"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </a>
        </li>
      ))}
      {uiState.desktopRunning &&
        <li>
          <button
            title='Move'
            onClick={() => moveEpisode(getEpisodeDetails({ episode, show }))}
          >
            <FontAwesomeIcon icon={faShuffle} />
          </button>
        </li>
      }
      {uiState.desktopRunning &&
        <li>
          <button
            title='Download'
            onClick={() => downloadEpisode(getEpisodeDetails({ episode, show }))}
          >
            <FontAwesomeIcon icon={faDownload} />
          </button>
        </li>
      }
    </ul>
  </div>
))

export default observer(({ episode, show }) => {
  const [showingFileName, setShowingFileName] = useState(false)
  const episodeNameRef = useRef()
  const fileNameRef = useRef()

  const handler = (e) => {
    if (showingFileName && e.target !== episodeNameRef.current) {
      setShowingFileName(false)
    }
  }

  useEffect(() => {
    eventBus.off('outside:click', handler)
    eventBus.on('outside:click', handler)

    if (showingFileName) {
      const node = fileNameRef.current
      const selection = window.getSelection()
      const range = document.createRange()

      range.selectNodeContents(node)
      selection.removeAllRanges()
      selection.addRange(range)
    }

    return () => {
      eventBus.off('outside:click', handler)
    }
  }, [showingFileName])

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
    'show-file-name': showingFileName,
  })

  return (
    <li className={className}>
      <Tooltip
        className="episode-tooltip options-tooltip tooltip"
        placement="right"
        title={<Options episode={episode} show={show} />}
        wrapperClassName="episode-number"
      >
        <span>{episode.shortEpisodeNumber}</span>
      </Tooltip>
      <span className="airdate">{date.shortString(episode.airdate)}</span>
      <span className="title">
        <span ref={episodeNameRef} onClick={() => setShowingFileName(true)}>{episode.title || 'TBA'}</span>
      </span>
      <span className="file-name" ref={fileNameRef}>
        {getFileName({ episode, show })}
      </span>
    </li>
  )
})
