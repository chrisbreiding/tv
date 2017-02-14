describe('design', () => {
  const ipcStub = () => ({
    once: cy.stub().as('ipc.once'),
    send: cy.stub().as('ipc.send'),
    on: cy.stub().as('ipc.on'),
  })
  let ipc
  let torrents

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
  })

  it('torrent picker', () => {
    ipc.on.withArgs('select:torrent:request').yield(null, torrents)
  })

  it('queue', () => {
    const addEpisode = (id, season, episode_number, displayName) => {
      ipc.on.withArgs('queue:episode:added').yield(null, {
        id,
        state: 'STARTED',
        episode: {
          id,
          season,
          episode_number,
          show: { displayName },
        },
        info: {},
      })
    }

    addEpisode(1, 4, 3, 'The Show About Nothing')
    addEpisode(2, 20, 23, 'The Show with the Coffee Shop')
    addEpisode(3, 12, 8, 'The Show with the Radio Show Psychiatrist')
    addEpisode(4, 3, 1, 'The Show in the Court')

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

    download(1)
    ipc.on.withArgs('queue:episode:updated').yield(null, {
      id: 2,
      state: 'FINISHED',
      info: {
        title: 'Finished handling episode for *The Show with the Coffee Shop*',
        message: '~/some/path/blah.blah.mkv*\nrenamed and moved to\n*~/some/other/path/So Nice - s2e01 - Yes.mkv*',
      },
    })
    ipc.on.withArgs('queue:episode:updated').yield(null, {
      id: 3,
      state: 'ERROR',
      error: {
        message: 'Could not download torrent blah blah',
        stack: 'Could not download torrent blah blah',
      },
    })
    ipc.on.withArgs('queue:episode:updated').yield(null, {
      id: 4,
      state: 'CANCELED',
      info: {
        title: 'Canceled selecting torrent',
      },
    })
  })
})
