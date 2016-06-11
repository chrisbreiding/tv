import _ from 'lodash';
import { action, observable } from 'mobx';

import api from '../data/api';
import SourceShowModel from './source-show-model';

class SearchStore {
  @observable results = [];
  @observable isLoading = false;

  @action setResults (results) {
    this.isLoading = false;
    this.results = _.map(results, (sourceShow) => new SourceShowModel(sourceShow));
  }

  @action searchSourceShows (query) {
    this.isLoading = true;
    api.searchSourceShows(query).then((results) => {
      this.setResults(results);
    });
  }
}

export default new SearchStore();
