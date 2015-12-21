import Immutable from 'immutable';
import moment from 'moment';

export function deserialize (sourceShows) {
  return Immutable.fromJS(sourceShows).map((sourceShow) => {
    return sourceShow.set('first_aired', moment(sourceShow.get('first_aired')));
  });
}
