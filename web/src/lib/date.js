import moment from 'moment';

const dateUtils = {
  isFarPast (momentDate) {
    return momentDate.isBefore(moment().subtract(2, 'months'), 'day');
  },

  isPast (momentDate) {
    return momentDate.isBefore(moment().subtract(5, 'days'), 'day');
  },

  isRecent (momentDate) {
    return momentDate.isBefore(moment(), 'day');
  },

  isToday (momentDate) {
    return momentDate.isSame(moment(), 'day');
  },

  isUpcoming (momentDate) {
    return momentDate.isAfter(moment().subtract(1, 'day'), 'day');
  },

  isFuture (momentDate) {
    return momentDate.isAfter(moment().add(1, 'month'), 'day');
  },

  isFarFuture (momentDate) {
    return momentDate.isAfter(moment().add(2, 'months'), 'day');
  },

  shortString (date) {
    if (!date) { return ''; }
    return date.format('YYYY-MM-DD');
  },

  longString (date) {
    if (!date) { return ''; }
    return date.format('MMM D, YYYY h:mma');
  },

  status (momentDateate) {
    return dateUtils.isToday(momentDateate)     ? 'today upcoming' :
           dateUtils.isFarPast(momentDateate)   ? 'far-past' :
           dateUtils.isPast(momentDateate)      ? 'past' :
           dateUtils.isRecent(momentDateate)    ? 'recent' :
           dateUtils.isFarFuture(momentDateate) ? 'far-future' :
           dateUtils.isFuture(momentDateate)    ? 'future' :
                                         'upcoming';
  },

  todayObject () {
    return { date: moment().toISOString() };
  },
};

export default dateUtils;
