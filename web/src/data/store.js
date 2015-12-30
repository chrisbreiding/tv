import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';

import cache from './cache';
import { serializeShows } from '../shows/util';
import { serializeEpisodes } from '../episodes/util';

const cacheMiddleware = store => next => action => {
  if (!localStorage.debug) { return next(action); }

  const prevState = store.getState();
  let result = next(action);
  const { shows, episodes } = store.getState();
  const showItems = shows.get('items');
  if (showItems.size && showItems !== prevState.shows.get('items')) {
    console.log('caching shows for debugging');
    cache.set(`snapshot-${new Date().toISOString()}-shows`, serializeShows(showItems));
  }
  if (episodes.size && episodes !== prevState.episodes) {
    console.log('caching episodes for debugging');
    cache.set(`snapshot-${new Date().toISOString()}-episodes`, serializeEpisodes(episodes));
  }
  return result;
};

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, cacheMiddleware)(createStore);
const rootReducer = combineReducers(reducers);
export default createStoreWithMiddleware(rootReducer);
