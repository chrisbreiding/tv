import Immutable from 'immutable';
import moment from 'moment';

const dateUtils = {
  compare (a, b) {
    return moment(a) - moment(b);
  },

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
    return moment(date).format('YYYY-MM-DD');
  },

  longString (date) {
    if (!date) { return ''; }
    return moment(date).format('MMM D, YYYY h:mma');
  },

  status (date) {
    date = moment(date);
    return dateUtils.isToday(date)     ? 'today upcoming' :
           dateUtils.isFarPast(date)   ? 'far-past' :
           dateUtils.isPast(date)      ? 'past' :
           dateUtils.isRecent(date)    ? 'recent' :
           dateUtils.isFarFuture(date) ? 'far-future' :
           dateUtils.isFuture(date)    ? 'future' :
                                         'upcoming';
  },

  todayMap () {
    return Immutable.Map({ date: moment().toISOString() });
  },
};

export default dateUtils;
