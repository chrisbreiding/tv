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

  it('loading', () => {})

  it('settings', () => {
    setTimeout(() => {
      ipc.once.withArgs('get:directories:response').yield(null, null, {
        downloads: '~/path/to/downloads',
        tvShows: '~/path/to/shows',
      })
    })
  })

  it.only('queue', () => {
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
    addEpisode(6, 1, 1, 'The Show About Five-O')
    addEpisode(2, 20, 23, 'The Show with the Coffee Shop')
    addEpisode(5, 7, 10, 'The Show with the Airport')
    addEpisode(3, 12, 20, 'The Show with the Radio Show Psychiatrist')
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
    ipc.on.withArgs('queue:episode:updated').yield(null, {
      id: 5,
      state: 'SELECT_TORRENT',
    })
    ipc.on.withArgs('select:torrent:request').yield(null, 5, torrents)
    ipc.on.withArgs('queue:episode:updated').yield(null, {
      id: 6,
      state: 'SELECT_FILE',
    })
    ipc.on.withArgs('select:file:request').yield(null, 6, [
      { path: '1', relativePath: '/path/to/The.Show.About.Five-Os01e01.mkv' },
      { path: '2', relativePath: '/path/to/The.Show.About.Five-O.101.VERY.lOng.and.PRObabLY.CAUSing.UI.T0.Scroll.A.BIT.avi' },
      { path: '3', relativePath: '/path/to/The.Show.About.Five-O.s1e1.Redneck.Party.YOLO.avi' },
    ])
  })
})
