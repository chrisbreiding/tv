import _ from 'lodash';
import { computed, observable } from 'mobx';

import EpisodeModel from '../episodes/episode-model';
import { sortAscending } from '../episodes/util';

export default class ShowModel {
  @observable id;
  @observable display_name;
  @observable search_name;
  @observable file_name;
  @observable source_id;
  @observable episode_ids;

  constructor (show) {
    this.id = show.id;
    this.display_name = show.display_name;
    this.search_name = show.search_name;
    this.file_name = show.file_name;
    this.source_id = show.source_id;
    this.episodes = _.map(show.episodes, (episode) => new EpisodeModel(episode));
  }

  @computed get hasRecent () {
    return this.recentEpisodes.length > 0;
  }

  @computed get recentEpisodes () {
    return _(this.episodes)
      .filter({ isRecent: true })
      .sort(sortAscending)
      .value();
  }

  @computed get hasUpcoming () {
    return this.upcomingEpisodes.length > 0;
  }

  @computed get upcomingEpisodes () {
    return _(this.episodes)
      .filter({ isUpcoming: true })
      .sort(sortAscending)
      .value();
  }

  @computed get isOffAir () {
    return !this.recentEpisodes.length && !this.upcomingEpisodes.length;
  }

  @computed get offAirEpisodes () {
    return [];
  }

  @computed get nextEpisode () {
    return this.upcomingEpisodes[0];
  }

  @computed get lastEpisode () {
    return this.recentEpisodes[0];
  }

  serialize () {
    return {
      id: this.id,
      display_name: this.display_name,
      search_name: this.search_name,
      file_name: this.file_name,
      source_id: this.source_id,
      episodes: _.map(this.episodes, (episode) => episode.serialize()),
    };
  }
}
