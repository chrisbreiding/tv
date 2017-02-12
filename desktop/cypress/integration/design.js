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
})
