export function pluckState (...props) {
  return (state) => {
    return props.reduce((stateSubset, key) => {
      if (!state[key]) { throw `The key '${key}' does not exist on the state tree. The following keys are available: ${Object.keys(state).join(', ')}`; }

      stateSubset[key] = state[key];
      return stateSubset;
    }, {});
  };
}
