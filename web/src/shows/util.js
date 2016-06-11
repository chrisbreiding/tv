import _ from 'lodash';
import {
  recentEpisodes,
  upcomingEpisodes,
  offAirEpisodes,
  sortAscending,
} from '../episodes/util';

export function showsWithEpisodes (shows, episodesIndex) {
  return shows.map((show) => showWithEpisodes(show, episodesIndex));
}

export function showWithEpisodes (show, episodesIndex) {
  const episodes = show.episode_ids
    .map((id) => episodesIndex[id])
    .sort(sortAscending);
  return _(show)
    .omit('episode_ids')
    .extend({ episodes })
    .value();
}

// export function recentShows (shows) {
//   return _(shows)
//     .filter(hasRecentEpisodes).sort((a, b) => {
//       return lastEpisode(b).airdate - lastEpisode(a).airdate;
//     })
//     .map((show) => {
//       return show.update('episodes', (episodes) => recentEpisodes(episodes));
//     })
//     .value();
// }

// export function upcomingShows (shows) {
//   return shows.filter(hasUpcomingEpisodes).sort((a, b) => {
//     return nextEpisode(a).airdate - nextEpisode(b).airdate;
//   }).map((show) => {
//     return show.update('episodes', (episodes) => upcomingEpisodes(episodes));
//   });
// }

// function sortAlphabetically (a, b) {
//   const aName = a.display_name.toLowerCase();
//   const bName = b.display_name.toLowerCase();
//   if (aName < bName) return -1;
//   if (aName > bName) return 1;
//   return 0;
// }
//
// export function offAirShows (shows) {
//   return shows.filter(isOffAir).sort(sortAlphabetically).map((show) => {
//     return show.update('episodes', (episodes) => offAirEpisodes(episodes));
//   });
// }
//
// function hasRecentEpisodes (show) {
//   return !recentEpisodes(show.episodes).isEmpty();
// }
//
// function hasUpcomingEpisodes (show) {
//   return !upcomingEpisodes(show.episodes).isEmpty();
// }
//
// function isOffAir (show) {
//   return !hasRecentEpisodes(show) && !hasUpcomingEpisodes(show);
// }
