import React from 'react'

import { MoreLess } from '../more-less/more-less'
import type { ShowModel } from '../shows/show-model'
import { Episode } from './episode'
import type { EpisodeModel } from './episode-model'

interface EpisodesProps {
  show: ShowModel
  episodes: EpisodeModel[]
  threshold?: number
}

export const Episodes = ({ show, episodes, threshold }: EpisodesProps) => (
  <MoreLess threshold={threshold || Infinity}>
    {episodes.map((episode) => (
      <Episode key={episode.id} show={show} episode={episode} />
    ))}
  </MoreLess>
)
