import React from 'react'

import Notifications from './notifications'
import PlexCredentials from '../plex/plex-credentials'
import Queue from '../queue/queue'
import Settings from '../settings/settings'

const App = () => (
  <div className='wrap'>
    <Settings />
    <Queue />
    <PlexCredentials />
    <Notifications />
  </div>
)

export default App
