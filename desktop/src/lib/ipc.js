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

ipc.on = (event, callback) => {
  ipcRenderer.on(event, (__, ...args) => {
    callback(...args)
  })
}

export default ipc
