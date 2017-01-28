import Promise from 'bluebird'

const ipcRenderer = window.ipcRenderer

const ipc = (event, data) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.once(`${event}:response`, (sender, error, response) => {
      error ? reject(error) : resolve(response)
    })
    ipcRenderer.send(`${event}:request`, data)
  })
}

export default ipc
