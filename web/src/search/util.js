import Immutable from 'immutable';

export function deserialize (sourceShows) {
  return Immutable.fromJS(sourceShows);
}
