import cs from 'classnames'
import { observer } from 'mobx-react'
import React from 'react'

import settingsApi from './settings-api'
import settingsStore from './settings-store'

import Loader from '../lib/loader'

const Settings = observer(() => {
  if (settingsStore.isLoading) {
    return (
      <main>
        <Loader message='Loading' />
      </main>
    )
  }

  return (
    <main className={cs('settings', {
      selecting: settingsStore.selectingDirectory,
    })}>
      <label>Downloads Directory</label>
      <div className='fieldset'>
        <p>{settingsStore.downloadsDirectory || '\u00A0'}</p>
        <button onClick={() => settingsApi.selectDirectory('downloads')}>
          Select
        </button>
      </div>
      <label>TV Shows Directory</label>
      <div className='fieldset'>
        <p>{settingsStore.tvShowsDirectory || '\u00A0'}</p>
        <button onClick={() => settingsApi.selectDirectory('tvShows')}>
          Select
        </button>
      </div>
      <div className='cover'></div>
    </main>
  )
})

export default Settings
