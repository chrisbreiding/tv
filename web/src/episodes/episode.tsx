import Tooltip from '@cypress/react-tooltip'
import {
  faMagnifyingGlass,
  faShuffle,
  faDownload,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cs from 'classnames'
import { observer } from 'mobx-react'
import React, { useEffect, useRef, useState } from 'react'

import {
  isFarFuture,
  isFarPast,
  isFuture,
  isPast,
  isRecent,
  isToday,
  isUpcoming,
  isYesterday,
  shortString,
} from '../lib/date'
import { uiState } from '../lib/ui-state'
import { eventBus, searchLink } from '../lib/util'
import { downloadEpisode, moveEpisode } from '../data/remote'
import { settingsStore } from '../settings/settings-store'
import type { ShowModel } from '../shows/show-model'
import type { EpisodeModel } from '../episodes/episode-model'

export interface EpisodeDetails {
  id: string
  season: number
  number: number
  title: string
  airdate: string
  fileName: string
  show: {
    displayName: string
    searchName: string
    fileName: string
  },
}

interface ShowAndEpisode {
  show: ShowModel
  episode: EpisodeModel
}

const getFileName = ({ episode, show }: ShowAndEpisode) => {
  return `${show.fileName} - ${episode.longEpisodeNumber} - ${episode.fileSafeTitle}`
}

const getEpisodeDetails = ({ episode, show }: ShowAndEpisode) => {
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
  } as EpisodeDetails
}

const Options = observer(({ episode, show }: ShowAndEpisode) => (
  <div className='options'>
    <ul>
      {settingsStore.searchLinks.map((link) => (
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

export const Episode = observer(({ episode, show }: ShowAndEpisode) => {
  const [showingFileName, setShowingFileName] = useState(false)
  const episodeNameRef = useRef<HTMLSpanElement>(null)
  const fileNameRef = useRef<HTMLSpanElement>(null)

  const handler = (e: Event) => {
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

      if (node) {
        range.selectNodeContents(node)
      }
      selection?.removeAllRanges()
      selection?.addRange(range)
    }

    return () => {
      eventBus.off('outside:click', handler)
    }
  }, [showingFileName])

  const airdate = episode.airdate
  const className = cs({
    'episode-single': true,
    yesterday: isYesterday(airdate),
    today: isToday(airdate),
    'far-past': isFarPast(airdate),
    past: isPast(airdate),
    recent: isRecent(airdate),
    upcoming: isUpcoming(airdate),
    future: isFuture(airdate),
    'far-future': isFarFuture(airdate),
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
      <span className="airdate">{shortString(episode.airdate)}</span>
      <span className="title">
        <span ref={episodeNameRef} onClick={() => setShowingFileName(true)}>{episode.title || 'TBA'}</span>
      </span>
      <span className="file-name" ref={fileNameRef}>
        {getFileName({ episode, show })}
      </span>
    </li>
  )
})
