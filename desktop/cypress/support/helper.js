const ipcStub = () => ({
  once: cy.stub().as('ipc.once'),
  send: cy.stub().as('ipc.send'),
  on: cy.stub().as('ipc.on'),
})
let ipc
let torrents

export const setup = () => {
  beforeEach(() => {
    ipc = ipcStub()

    cy
      .fixture('torrents').then((fixtureTorrents) => {
        torrents = fixtureTorrents
      })
      .visit('http://localhost:8000', {
        onBeforeLoad (win) {
          win.ipcRenderer = ipc
        },
      })
      .wait(1)
  })
}

const loadSettings = () => {
  ipc.once.withArgs('get:settings:response').yield(null, null, {
    directories: {
      downloads: '~/path/to/downloads',
      tvShows: '~/path/to/shows',
    },
    plexToken: 'ABC123',
  })
}

export const settingsLoading = () => cy.contains('Settings').click()

export const settings = () => {
  cy.contains('Settings').click()
  loadSettings()
}

export const plexCredentials = () => {
  loadSettings()
  ipc.on.withArgs('get:plex:credentials:request').yield()
}

export const notifications = () => {
  const notify = (notification) => {
    ipc.on.withArgs('notification').yield(null, notification)
  }

  notify({
    title: 'This is a good one with details',
    message: 'These are the\n\n**details**',
    type: 'success',
  })
  notify({
    title: 'This is a good one without details',
    type: 'success',
  })
  notify({
    title: 'This is a neutral one with details',
    message: 'These are the\n\n**details**',
    type: 'info',
  })
  notify({
    title: 'This is a neutral one without details',
    type: 'info',
  })
  notify({
    title: 'This is a bad one with details',
    message: 'These are the\n\n**details**',
    type: 'error',
  })
  notify({
    title: 'This is a bad one without details',
    type: 'error',
  })
}

export const queueEmpty = () => {
  ipc.once.withArgs('fetch:queue:response').yield(null, null, [])
}

export const queue = () => {
  const episode = (id, season, number, displayName) => ({
    id,
    state: 'STARTED',
    episode: {
      id,
      season,
      number,
      show: { displayName },
    },
    info: {},
  })

  ipc.once.withArgs('fetch:queue:response').yield(null, null, [
    episode(1, 4, 3, 'The Show About Nothing'),
    episode(6, 1, 1, 'The Show About Five-O'),
    episode(2, 20, 23, 'The Show with the Coffee Shop'),
    episode(5, 7, 10, 'The Show with the Airport'),
    episode(3, 12, 20, 'The Show with the Radio Show Psychiatrist'),
    episode(7, 4, 15, 'The Show that is Unscripted'),
    episode(4, 3, 1, 'The Show in the Court'),
  ])

  let progress = 0

  const sendProgress = (id, progress, timeRemaining) => {
    ipc.on.withArgs('queue:episode:updated').yield(null, {
      id,
      state: 'DOWNLOADING_TORRENT',
      info: {
        progress,
        timeRemaining,
      },
    })
  }

  const download = (id) => {
    const time = 300000

    const interval = setInterval(() => {
      progress = Math.round((progress + 0.1) * 10) / 10
      if (progress >= 1) {
        sendProgress(id, 1, 0)
        clearInterval(interval)
      } else {
        sendProgress(id, progress, time - (progress * time))
      }
    }, Math.random() * 1000 + 1000)

    sendProgress(id, 0, null)
  }

  cy.wait(1).then(() => {
    download(1)
    ipc.on.withArgs('queue:episode:updated').yield(null, {
      id: 2,
      state: 'FINISHED',
      info: {
        title: 'Finished handling episode for *The Show with the Coffee Shop*',
        message: '*~/some/path/blah.blah.mkv*\n\nrenamed and moved to\n\n*~/some/other/path/So Nice - s2e01 - Yes.mkv*',
      },
    })
    ipc.on.withArgs('queue:episode:updated').yield(null, {
      id: 3,
      state: 'FAILED',
      info: {
        title: 'Could not download torrent blah blah',
        message: 'Could not download torrent blah blah',
      },
    })
    ipc.on.withArgs('queue:episode:updated').yield(null, {
      id: 4,
      state: 'CANCELED',
      info: {
        title: 'Canceled selecting torrent',
      },
    })
    ipc.on.withArgs('queue:episode:updated').yield(null, {
      id: 5,
      state: 'SELECT_TORRENT',
      items: torrents,
    })
    ipc.on.withArgs('select:torrent:request').yield(null, 5)
    ipc.on.withArgs('queue:episode:updated').yield(null, {
      id: 6,
      state: 'SELECT_FILE',
      items: [
        { path: '1', relativePath: '/path/to/The.Show.About.Five-Os01e01.mkv' },
        { path: '2', relativePath: '/path/to/The.Show.About.Five-O.101.VERY.lOng.and.PRObabLY.CAUSing.UI.T0.Scroll.A.BIT.avi' },
        { path: '3', relativePath: '/path/to/The.Show.About.Five-O.s1e1.Redneck.Party.YOLO.avi' },
      ],
    })
    ipc.on.withArgs('select:file:request').yield(null, 6)
    ipc.on.withArgs('queue:episode:updated').yield(null, {
      id: 7,
      state: 'SELECT_TORRENT',
      items: [],
    })
    ipc.on.withArgs('select:torrent:request').yield(null, 7)
  })
}
