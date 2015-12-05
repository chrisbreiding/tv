import moment from 'moment';

export default {
  compare (a, b) {
    return moment(a) - moment(b);
  },

  isToday (date) {
    return date.isSame(moment(), 'day');
  },

  isFarPast (date) {
    return date.isBefore(moment().subtract(2, 'months'), 'day');
  },

  isPast (date) {
    return date.isBefore(moment().subtract(5, 'days'), 'day');
  },

  isRecent (date) {
    return date.isBefore(moment(), 'day');
  },

  isFarFuture (date) {
    return date.isAfter(moment().add(2, 'months'), 'day');
  },

  isFuture (date) {
    return date.isAfter(moment().add(1, 'month'), 'day');
  }
};
