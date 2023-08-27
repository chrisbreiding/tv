import axios, { AxiosError } from 'axios'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { migrate } from '../data/migrate'
import { pollDesktopConnection } from '../data/remote'
import { uiState } from '../lib/ui-state'
import { eventBus } from '../lib/util'

import { Loader } from '../loader/loader'
import { Messages } from '../messages/messages'
import { Header } from './header'
import { showsStore } from '../shows/shows-store'
import { settingsStore } from '../settings/settings-store'
import { loadShows } from '../shows/shows-api'
import { loadSettings } from '../settings/settings-api'

export const App = observer(() => {
  const [migrating, setMigrating] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const redirectOn401 = axios.interceptors.response.use(null, (error: AxiosError) => {
      if (error.response?.status === 401) {
        navigate('/auth')
        return
      }
      return Promise.reject(error)
    })

    pollDesktopConnection(action('ping:desktop', (desktopRunning: boolean) => {
      uiState.desktopRunning = desktopRunning
    }))

    const onOutsideClick = (e: MouseEvent) => {
      eventBus.emit('outside:click', e)
    }

    document.addEventListener('click', onOutsideClick)

    migrate().then(() => {
      setMigrating(false)

      loadShows()
      loadSettings()
    })

    return () => {
      document.removeEventListener('click', onOutsideClick)
      axios.interceptors.request.eject(redirectOn401)
    }
  }, [true])

  if (migrating || showsStore.isLoadingFromCache || settingsStore.isLoadingFromCache) {
    return (
      <div className="loading-container full-screen-centered">
        <Loader>Loading shows...</Loader>
      </div>
    )
  }

  return (
    <>
      <Header />
      <Outlet />
      <Messages />
    </>
  )
})
