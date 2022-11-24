import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import stats from '../lib/stats'
import cache from '../data/cache'
import { getApiKey, setApiKey } from '../data/api'
import { AutoFocusedInput } from '../lib/form'

export default () => {
  useEffect(() => {
    stats.send('Visit Auth')
  }, [true])

  const navigate = useNavigate()
  const apiKeyRef = useRef()

  const submit = (e) => {
    e.preventDefault()

    const apiKey = apiKeyRef.current.value
    stats.send('Sign In', { apiKey })
    setApiKey(apiKey)

    cache.clear().then(() => {
      navigate('/')
    })
  }

  return (
    <div className="auth">
      <form className="form" onSubmit={submit}>
        <p>Your API key is missing or invalid. Please authenticate.</p>

        <fieldset>
          <label>API Key</label>
          <AutoFocusedInput ref={apiKeyRef} defaultValue={getApiKey()} />
        </fieldset>

        <footer className="clearfix">
          <button type="submit">Authenticate</button>
        </footer>
      </form>
    </div>
  )
}
