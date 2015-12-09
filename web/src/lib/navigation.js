import { updatePath } from 'redux-simple-router';

export function navigateHome () {
  return updatePath('/shows');
}

export function navigateTo (path) {
  return updatePath(path);
}
