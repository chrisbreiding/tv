import type { Dayjs, OpUnitType } from 'dayjs'
import type { EpisodeModel } from '../episodes/episode-model'

export type Status = 'Upcoming' | 'Continuing' | 'Ended'

export interface SearchResultShowProps {
  description: string
  firstAired?: string
  id: string
  name: string
  network: string
  poster?: string
  status: Status
}

export interface ShowProps {
  displayName: string
  episodes: (EpisodeProps | EpisodeModel)[]
  fileName: string
  id: string
  network: string
  poster: string
  searchName: string
  status: Status
}

export interface UpdateShowProps {
  id: string
  displayName: string
  searchName: string
  fileName: string
}

export interface EpisodeProps {
  airdate?: string
  number: number
  id: string
  season: number
  title: string
}

export interface Airdate {
  isNull?: boolean
  isSame: (date: Dayjs, unit?: OpUnitType) => boolean
  isBefore: (date: Dayjs, unit?: OpUnitType) => boolean
  isBetween: (date1: Dayjs, date2: Dayjs) => boolean
  isAfter: (date: Dayjs, unit?: OpUnitType) => boolean
  toISOString: () => string
  format: (format: string) => string
  valueOf: () => number
}

export interface SearchLink {
  name: string
  showLink: string
  episodeLink: string
}

export interface SettingsProps {
  hideSpecialEpisodes: boolean
  hideTBAEpisodes: 'ALL' | 'NONE'
  isAdmin: boolean
  lastUpdated: string
  preferredView: 'list' | 'calendar'
  searchLinks: SearchLink[]
  username: string
}

export type UpdateSettingsProps = Pick<SettingsProps, 'hideSpecialEpisodes' | 'hideTBAEpisodes' | 'preferredView' | 'searchLinks'>
