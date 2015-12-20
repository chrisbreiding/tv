import Immutable from 'immutable';
import moment from 'moment';

export function deserialize (settings) {
  if (!settings) { return Immutable.Map(); }

  return Immutable.Map({
    last_updated: moment(settings.last_updated),
    view_link: settings.view_link
  });
}

export function serialize (settings) {
  return {
    last_updated: settings.get('last_updated').toISOString(),
    view_link: settings.get('view_link')
  };
}
