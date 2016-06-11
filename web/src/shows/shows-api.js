import { action } from 'mobx';
import moment from 'moment';

import cache, { SHOWS, DATE_SHOWS_UPDATED } from '../data/cache';
import api from '../data/api';
import date from '../lib/date';
import messagesStore from '../messages/messages-store';
import showsStore from './shows-store';

function getShowsFromCache () {
  return cache.get(SHOWS);
}

function getShowsFromApi () {
  return api.getShows().then(({ shows, episodes }) => {
    const showsWithEpisodes = showsStore.showsWithEpisodes(shows, episodes);
    cache.set(SHOWS, showsWithEpisodes);
    return showsWithEpisodes;
  });
}

function evaluateCache (shows) {
  return shows || getShowsFromApi();
}

const updateShows = action('updateShows', (shows) => {
  showsStore.setShows(shows);
  showsStore.isLoading = false;
});

const loadShows = action('loadShows', () => {
  showsStore.isLoading = true;

  getShowsFromCache()
    .then(evaluateCache)
    .then(updateShows)
    .then(() => cache.get(DATE_SHOWS_UPDATED))
    .then((dateUpdated) => {
      if (dateUpdated && !date.isToday(moment(dateUpdated.date))) {
        getShowsFromApi().then(updateShows);
      }
      cache.set(DATE_SHOWS_UPDATED, date.todayObject());
    });
});

const addShow = action('addShow', (showToAdd) => {
  const message = messagesStore.add(`Adding ${showToAdd.display_name}...`);
  api.addShow(showToAdd).then(action('showAdded', ({ show, episodes }) => {
    const showWithEpisodes = showsStore.showsWithEpisodes([show], episodes)[0];
    showsStore.addShow(showWithEpisodes);
    cache.set(SHOWS, showsStore.serialize());
    messagesStore.remove(message);
  }));
});

const updateShow = action('updateShow', (showProps) => {
  api.updateShow(showProps);
  showsStore.updateShow(showProps);
  cache.set(SHOWS, showsStore.serialize());
});

const deleteShow = action('deleteShow', (show) => {
  api.deleteShow(show);
  showsStore.deleteShow(show);
  cache.set(SHOWS, showsStore.serialize());
});

export {
  loadShows,
  addShow,
  updateShow,
  deleteShow,
};
