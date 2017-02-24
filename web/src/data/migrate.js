import localforage from 'localforage';

const migrations = {
  1 () {
    return localforage.clear();
  },

  2 () {
    return localforage.clear();
  },
};

function run (version) {
  return migrations[version] ?
    migrations[version]().then(() => run(version + 1)) :
    Promise.resolve(version - 1);
}

export default function () {
  let currentDataVersion = Number(localStorage.dataVersion || 0);
  return run(currentDataVersion + 1).then((newVersion) => {
    localStorage.dataVersion = newVersion;
  });
}
