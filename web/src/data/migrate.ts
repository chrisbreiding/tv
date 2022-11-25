import localforage from 'localforage'

const migrations = [
  () => {
    return localforage.clear()
  },
  () => {
    return localforage.clear()
  },
]

async function run (version: number): Promise<number> {
  const migration = migrations[version - 1]

  if (!migration) {
    return version - 1
  }

  await migration()

  return run(version + 1)
}

export async function migrate () {
  const currentDataVersion = Number(localStorage.dataVersion || 0)
  const newVersion = await run(currentDataVersion + 1)

  localStorage.dataVersion = newVersion
}
