import Immutable from 'immutable';
import { deserializeEpisodes, serializableEpisodes, recentEpisodes, upcomingEpisodes, offAirEpisodes, sortAscending } from '../episodes/util';
import date from '../lib/date';

export function deserializeShows (shows) {
  return Immutable.fromJS(shows);
}

export function deserializeShow (show) {
  return Immutable.fromJS(show);
}

export function deserializeShowsAndEpisodes (shows) {
  return Immutable.List(shows).map(deserializeShowAndEpisodes);
}

export function deserializeShowAndEpisodes (show) {
  return Immutable.Map(show).set('episodes', deserializeEpisodes(show.episodes));
}

export function serializeShows (shows) {
  return shows.map(serializableShow).toJS();
}

export function serializeShow (show) {
  return show.toJS();
}

export function serializeShowAndEpisodes (show) {
  return serializableShow(show).toJS();
}

function serializableShow (show) {
  return show.update('episodes', serializableEpisodes);
}

export function showsWithEpisodes (shows, episodesIndex) {
  return shows.map(show => showWithEpisodes(show, episodesIndex));
}

export function showWithEpisodes (show, episodesIndex) {
  const episodes = show.get('episode_ids')
    .map((id) => episodesIndex.get(`${id}`))
    .sort(sortAscending);
  return show.set('episodes', episodes).delete('episode_ids');
}

export function recentShows (shows) {
  return shows.filter(hasRecentEpisodes).sort((a, b) => {
    return lastEpisode(b).get('airdate') - lastEpisode(a).get('airdate');
  }).map(show => {
    return show.update('episodes', episodes => recentEpisodes(episodes));
  });
}

export function upcomingShows (shows) {
  return shows.filter(hasUpcomingEpisodes).sort((a, b) => {
    return nextEpisode(a).get('airdate') - nextEpisode(b).get('airdate');
  }).map(show => {
    return show.update('episodes', episodes => upcomingEpisodes(episodes));
  });
}

function sortAlphabetically (a, b) {
  const aName = a.get('display_name').toLowerCase();
  const bName = b.get('display_name').toLowerCase();
  if (aName < bName) { return -1; }
  if (aName > bName) { return 1; }
  return 0;
}

export function offAirShows (shows) {
  return shows.filter(isOffAir).sort(sortAlphabetically).map(show => {
    return show.update('episodes', episodes => offAirEpisodes(episodes));
  });
}

function hasRecentEpisodes (show) {
  return !recentEpisodes(show.get('episodes')).isEmpty();
}

function hasUpcomingEpisodes (show) {
  return !upcomingEpisodes(show.get('episodes')).isEmpty();
}

function isOffAir (show) {
  return !hasRecentEpisodes(show) && !hasUpcomingEpisodes(show);
}

function nextEpisode (show) {
  return upcomingEpisodes(show.get('episodes')).first();
}

function lastEpisode (show) {
  return recentEpisodes(show.get('episodes')).first();
}
