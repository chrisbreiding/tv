import { computed, observable } from 'mobx';
import moment from 'moment';

let recentDaysCutoff = localStorage.recentDaysCutoff || 5;

function toTwoDigitString (num) {
  return num < 10 ? `0${num}` : `${num}`;
}

export default class EpisodeModel {
  @observable id;
  @observable season;
  @observable episode_number;
  @observable title;
  @observable airdate;

  constructor (episode) {
    this.id = episode.id;
    this.season = episode.season;
    this.episode_number = episode.episode_number;
    this.title = episode.title;
    this.airdate = moment(episode.airdate);
  }

  @computed get isRecent () {
    let startOfiveDaysAgo = moment().subtract(recentDaysCutoff, 'days').startOf('day');
    let startOfToday = moment().startOf('day');
    return this.airdate.isBetween(startOfiveDaysAgo.subtract(1, 'second'), startOfToday);
  }

  @computed get isUpcoming () {
    let startOfToday = moment().startOf('day');
    return this.airdate.isAfter(startOfToday.subtract(1, 'second'));
  }

  @computed get longEpisodeNumber () {
    let season = toTwoDigitString(this.season);
    let episodeNumber = toTwoDigitString(this.episode_number);
    return `s${season}e${episodeNumber}`;
  }

  @computed get shortEpisodeNumber () {
    return this.longEpisodeNumber
     .replace('s0', '')
     .replace(/[se]/g, '');
  }

  @computed get fileSafeTitle () {
    if (this.title == null) {
      return '';
    }

    return this.title
      .replace(/[\/\\]/g, '-')
      .replace(/\:\s+/g, ' - ')
      .replace(/\&/g, 'and')
      .replace(/[\.\!\?\@\#\$\%\^\*\:]/g, '');
  }

  serialize () {
    return {
      id: this.id,
      season: this.season,
      episode_number: this.episode_number,
      title: this.title,
      airdate: this.airdate.toISOString(),
    };
  }
}
