export const RECEIVE_EPISODES = 'RECEIVE_EPISODES';
export function receiveEpisodes (episodes) {
  return {
    type: RECEIVE_EPISODES,
    episodes
  };
}

export const EPISODES_ADDED = 'EPISODES_ADDED';
export function episodesAdded (episodes) {
  return {
    type: EPISODES_ADDED,
    episodes
  };
}
