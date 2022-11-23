import axios from 'axios'
import { action } from 'mobx'
import React, { Component } from 'react'
import { Outlet } from 'react-router-dom'

import Messages from '../messages/messages'
import Loader from '../loader/loader'
import stats from '../lib/stats'
import api from '../data/api'
import migrate from '../data/migrate'
import uiState from '../lib/ui-state'
import AppOptions from './app-options'
import { withRouter } from '../lib/with-router'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = { ready: false }
  }

  componentDidMount () {
    stats.send('Visit App')

    axios.interceptors.response.use(null, (error) => {
      if (error.response?.status === 401) {
        this.props.navigate('/auth')
        return
      }
      return Promise.reject(error)
    })

    migrate().then(() => this.setState({ ready: true }))

    api.pollDesktopConnection(action('ping:desktop', (desktopRunning) => {
      uiState.desktopRunning = desktopRunning
    }))
  }

  render () {
    return this.state.ready ? this._container() : this._loading()
  }

  _container () {
    return (
      <>
        <AppOptions />
        <Outlet />
        <Messages />
      </>
    )
  }

  _loading () {
    return (
      <p className="full-screen-centered">
        <Loader>Updating...</Loader>
      </p>
    )
  }
}

export default withRouter(App)
