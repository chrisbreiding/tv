import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { cache } from '../data/cache'
import { getApiKey, setApiKey, sendStats } from '../data/remote'
import { AutoFocusedInput } from '../lib/form'

export const Auth = () => {
  useEffect(() => {
    sendStats('Visit Auth')
  }, [true])

  const navigate = useNavigate()
  const apiKeyRef = useRef<HTMLInputElement>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    const apiKey = apiKeyRef.current?.value

    if (!apiKey) return

    sendStats('Sign In', { apiKey })
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
