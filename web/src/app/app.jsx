import axios from 'axios'
import { action } from 'mobx'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import api from '../data/api'
import migrate from '../data/migrate'
import uiState from '../lib/ui-state'
import { eventBus } from '../lib/util'

import Loader from '../loader/loader'
import Messages from '../messages/messages'
import AppOptions from './app-options'
import TimePeriods from '../time-periods/time-periods'

export default () => {
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const redirectOn401 = axios.interceptors.response.use(null, (error) => {
      if (error.response?.status === 401) {
        navigate('/auth')
        return
      }
      return Promise.reject(error)
    })

    api.pollDesktopConnection(action('ping:desktop', (desktopRunning) => {
      uiState.desktopRunning = desktopRunning
    }))

    const handler = (e) => {
      eventBus.emit('outside:click', e)
    }

    document.addEventListener('click', handler)

    migrate().then(() => setReady(true))

    return () => {
      document.removeEventListener('click', handler)
      axios.interceptors.request.eject(redirectOn401)
    }
  }, [true])

  return ready ?
    (
      <>
        <AppOptions />
        <TimePeriods />
        <Messages />
      </>
    ) : (
      <p className="full-screen-centered">
        <Loader>Updating...</Loader>
      </p>
    )
}
