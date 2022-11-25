import dayjs, { Dayjs } from 'dayjs'

import type { Airdate } from './types'

export function now () {
  return dayjs(localStorage.now)
}

export function isFarPast (dayjsDate: Airdate | Dayjs) {
  return dayjsDate.isBefore(now().subtract(2, 'months'), 'day')
}

export function isPast (dayjsDate: Airdate | Dayjs) {
  return dayjsDate.isBefore(now().subtract(5, 'days'), 'day')
}

export function isRecent (dayjsDate: Airdate | Dayjs) {
  return dayjsDate.isBefore(now(), 'day')
}

export function isYesterday (dayjsDate: Airdate | Dayjs) {
  return dayjsDate.isSame(now().subtract(1, 'day'), 'day')
}

export function isToday (dayjsDate: Airdate | Dayjs) {
  return dayjsDate.isSame(now(), 'day')
}

export function isUpcoming (dayjsDate: Airdate | Dayjs) {
  return dayjsDate.isAfter(now().subtract(1, 'day'), 'day')
}

export function isFuture (dayjsDate: Airdate | Dayjs) {
  return dayjsDate.isAfter(now().add(1, 'month'), 'day')
}

export function isFarFuture (dayjsDate: Airdate | Dayjs) {
  return dayjsDate.isAfter(now().add(2, 'months'), 'day')
}

export function shortString (dayjsDate?: Airdate | Dayjs) {
  if (!dayjsDate) return ''

  return dayjsDate.format('YYYY-MM-DD')
}

export function longString (dayjsDate?: Airdate | Dayjs) {
  if (!dayjsDate) return ''

  return dayjsDate.format('MMM D, YYYY h:mma')
}

export function status (dayjsDate: Airdate | Dayjs) {
  return isToday(dayjsDate) ? 'today upcoming' :
    isFarPast(dayjsDate) ? 'far-past' :
      isPast(dayjsDate) ? 'past' :
        isRecent(dayjsDate) ? 'recent' :
          isFarFuture(dayjsDate) ? 'far-future' :
            isFuture(dayjsDate) ? 'future' :
              'upcoming'
}

export function todayObject () {
  return { date: now().toISOString() }
}
