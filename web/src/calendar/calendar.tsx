import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cs from 'classnames'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import React, { useState } from 'react'

import { showsStore } from '../shows/shows-store'
import { Link, Outlet } from 'react-router-dom'
import { now } from '../lib/date'

const Date = observer(({ activeDate, date }: { activeDate: dayjs.Dayjs, date: dayjs.Dayjs }) => {
  const today = now()
  const shows = showsStore.getShowsForDate(date)
  const className = cs('calendar-date', {
    'is-neighboring-month': !activeDate.isSame(date, 'month'),
    'is-weekend': date.day() === 0 || date.day() === 6,
    'is-now': today.isSame(date, 'date'),
    'is-past': today.add(1, 'day').isAfter(date, 'date'),
  })
  const formattedDate = date.format('YYYY-MM-DD')

  if (!shows.length) {
    return (
      <div className={className} data-date={formattedDate}>
        <div className='calendar-date-number'>{date.date()}</div>
      </div>
    )
  }

  return (
    <Link to={formattedDate} className={className} data-date={formattedDate}>
      <div className='calendar-date-number'>{date.date()}</div>
      <ul>
        {shows.map((show) => (
          <li key={show.id}>
            {show.displayName}{show.episodes.length > 1 ? ` (${show.episodes.length})` : ''}
          </li>
        ))}
      </ul>
    </Link>
  )
})

const getFirstDateOfFirstWeek = (date: dayjs.Dayjs): dayjs.Dayjs => {
  if (date.day() === 0) return date

  return getFirstDateOfFirstWeek(date.subtract(1, 'day'))
}

const gatherMonthDates = (
  baseDate: dayjs.Dayjs,
  currentDate: dayjs.Dayjs,
  dates: dayjs.Dayjs[],
): dayjs.Dayjs[] => {
  if (currentDate.isAfter(baseDate, 'month') && currentDate.day() === 0) {
    return dates
  }

  return gatherMonthDates(
    baseDate,
    currentDate.add(1, 'day'),
    dates.concat(currentDate),
  )
}

const getMonthDates = (date: dayjs.Dayjs) => {
  const firstOfMonth = date.set('date', 1)
  const firstDateOfFirstWeek = getFirstDateOfFirstWeek(firstOfMonth)

  return gatherMonthDates(date, firstDateOfFirstWeek, [])
}

export const Calendar = observer(() => {
  const today = now()
  const [activeDate, setDate] = useState(today)
  const monthDates = getMonthDates(activeDate)

  const onToday = () => {
    setDate(today)
  }

  const onPrevious = () => {
    setDate(activeDate.subtract(1, 'month'))
  }

  const onNext = () => {
    setDate(activeDate.add(1, 'month'))
  }

  const isThisMonth = today.isSame(activeDate, 'month')

  return (
    <div className={cs('calendar', { 'is-this-month': isThisMonth })}>
      <div className='calendar-navigation'>
        <button className='calendar-today' onClick={onToday}>Today</button>
        <div className='spacer' />
        <button className='calendar-previous' onClick={onPrevious}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div className='calendar-month'>{activeDate.format('MMMM')}</div>
        <button className='calendar-next' onClick={onNext}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        <div className='spacer' />
        <button className='calendar-today-balancer'>Today</button>
      </div>
      <div className='calendar-weekdays'>
        {([0, 1, 2, 3, 4, 5, 6]).map((index) => (
          <div className='calendar-weekday' key={index}>
            {dayjs().set('day', index).format('ddd')}
          </div>
        ))}
      </div>
      <div className='calendar-dates'>
        {monthDates.map((date) => (
          <Date key={date.toISOString()} activeDate={activeDate} date={date} />
        ))}
      </div>
      <Outlet />
    </div>
  )
})
