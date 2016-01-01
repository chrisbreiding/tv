import Immutable from 'immutable';
import moment from 'moment';
import date from '../lib/date';

let recentDaysCutoff = localStorage.recentDaysCutoff || 5;

export function deserializeEpisodes (episodes) {
  return Immutable.fromJS(episodes).map((episode) => {
    return episode.update('airdate', airdate => moment(airdate));
  });
}

export function serializableEpisodes (episodes) {
  return episodes.map(episode => {
    return episode.update('airdate', airdate => airdate.toISOString());
  });
}

export function index (episodes) {
  return episodes.reduce((coll, episode) => {
    coll[episode.id] = episode;
    return coll;
  }, {});
}

export function recentEpisodes (episodes) {
  return episodes.filter(isRecent);
}

export function upcomingEpisodes (episodes) {
  return episodes.filter(isUpcoming);
}

export function offAirEpisodes () {
  return Immutable.List();
}

export function sortAscending (a, b) {
  const dateComparison = a.get('airdate') - b.get('airdate');
  if (!dateComparison) {
    const seasonComparison = a.get('season') - b.get('season');
    if (!seasonComparison) {
      return a.get('episode_number') - b.get('episode_number');
    }
  }
  return dateComparison;
}

export function fileSafeTitle (episode) {
  var title = episode.get('title');
  if (title == null) {
    return '';
  }

  return title
    .replace(/[\/\\]/g, '-')
    .replace(/\:\s+/g, ' - ')
    .replace(/\&/g, 'and')
    .replace(/[\.\!\?\@\#\$\%\^\*\:]/g, '');
}

function isRecent (episode) {
  let airdate = episode.get('airdate');
  let startOfiveDaysAgo = moment().subtract(recentDaysCutoff, 'days').startOf('day');
  let startOfToday = moment().startOf('day');
  return airdate.isBetween(startOfiveDaysAgo.subtract(1, 'second'), startOfToday);
}

function isUpcoming (episode) {
  let airdate = episode.get('airdate');
  let startOfToday = moment().startOf('day');
  return airdate.isAfter(startOfToday.subtract(1, 'second'));
}

export function longEpisodeNumber (episode) {
  let season = toTwoDigitString(episode.get('season'));
  let episodeNumber = toTwoDigitString(episode.get('episode_number'));
  return `s${season}e${episodeNumber}`;
}

export function shortEpisodeNumber (episode) {
  return longEpisodeNumber(episode)
   .replace('s0', '')
   .replace(/[se]/g, '');
}

function toTwoDigitString (num) {
  return num < 10 ? `0${num}` : `${num}`;
}
