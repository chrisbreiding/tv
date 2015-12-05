import { upcomingEpisodes, recentEpisodes, sortAscending } from './episodes';
import date from './date';

export function withEpisodes (shows, episodesIndex) {
  return shows.map((show) => {
    const episodes = show.get('episodes')
      .map((id) => episodesIndex.get(id))
      .sort(sortAscending);
    return show.set('episodes', episodes);
  });
}

export function recentShows (shows) {
  return shows.filter(hasRecentEpisodes).sort((a, b) => {
    return date.compare(lastEpisode(b).get('airdate'),
                        lastEpisode(a).get('airdate'));
  });
}

export function upcomingShows (shows) {
  return shows.filter(hasUpcomingEpisodes).sort((a, b) => {
    return date.compare(nextEpisode(a).get('airdate'),
                        nextEpisode(b).get('airdate'));
  });
}

export function offAirShows (shows) {
  return shows.filter(isOffAir);
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
