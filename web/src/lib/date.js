import dayjs from 'dayjs'

const dateUtils = {
  isFarPast (dayjsDate) {
    return dayjsDate.isBefore(dayjs().subtract(2, 'months'), 'day')
  },

  isPast (dayjsDate) {
    return dayjsDate.isBefore(dayjs().subtract(5, 'days'), 'day')
  },

  isRecent (dayjsDate) {
    return dayjsDate.isBefore(dayjs(), 'day')
  },

  isYesterday (dayjsDate) {
    return dayjsDate.isSame(dayjs().subtract(1, 'day'), 'day')
  },

  isToday (dayjsDate) {
    return dayjsDate.isSame(dayjs(), 'day')
  },

  isUpcoming (dayjsDate) {
    return dayjsDate.isAfter(dayjs().subtract(1, 'day'), 'day')
  },

  isFuture (dayjsDate) {
    return dayjsDate.isAfter(dayjs().add(1, 'month'), 'day')
  },

  isFarFuture (dayjsDate) {
    return dayjsDate.isAfter(dayjs().add(2, 'months'), 'day')
  },

  shortString (date) {
    if (!date) { return '' }
    return date.format('YYYY-MM-DD')
  },

  longString (date) {
    if (!date) { return '' }
    return date.format('MMM D, YYYY h:mma')
  },

  status (dayjsDate) {
    return dateUtils.isToday(dayjsDate) ? 'today upcoming' :
      dateUtils.isFarPast(dayjsDate) ? 'far-past' :
        dateUtils.isPast(dayjsDate) ? 'past' :
          dateUtils.isRecent(dayjsDate) ? 'recent' :
            dateUtils.isFarFuture(dayjsDate) ? 'far-future' :
              dateUtils.isFuture(dayjsDate) ? 'future' :
                'upcoming'
  },

  todayObject () {
    return { date: dayjs().toISOString() }
  },
}

export default dateUtils
