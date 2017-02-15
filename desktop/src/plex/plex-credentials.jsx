import _ from 'lodash'
import React from 'react'

const PlexCredentials = ({ onCancel, onSubmit }) => {
  let authTokenNode

  const cancel = (e) => {
    e.preventDefault()
    onCancel()
  }

  const submit = (e) => {
    e.preventDefault()

    onSubmit({
      authToken: _.trim(authTokenNode.value),
    })
  }

  return (
    <main className='plex-credentials'>
      <h1>Enter your Plex Auth Token</h1>
      <p>This enables auto-refreshing after a show is added</p>
      <form onSubmit={submit}>
        <div className='fieldset'>
          <label>Auth Token</label>
          <input ref={(node) => authTokenNode = node} />
        </div>
        <div className='fieldset'>
          <a onClick={cancel} href="#">Cancel</a>
          <button>Submit</button>
        </div>
      </form>
    </main>
  )
}

export default PlexCredentials
