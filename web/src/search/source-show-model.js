import { observable } from 'mobx';
import moment from 'moment';

export default class SourceShowModel {
  @observable banner;
  @observable description;
  @observable firstAired;
  @observable id;
  @observable name;
  @observable network;

  constructor (sourceShow) {
    this.banner = sourceShow.banner;
    this.description = sourceShow.description;
    this.firstAired = moment(sourceShow.first_aired);
    this.id = sourceShow.id;
    this.name = sourceShow.name;
    this.network = sourceShow.network;
  }
}
