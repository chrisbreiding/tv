import {
  setup,
  settingsLoading,
  settings,
  plexCredentials,
  notifications,
  queueEmpty,
  queue,
} from '../support/helper'

describe('design', () => {
  setup()

  it('settings loading', settingsLoading)
  it('settings', settings)
  it('plex credentials', plexCredentials)
  it('notifications', notifications)
  it('queue loading', () => {})
  it('queue empty', queueEmpty)
  it.only('queue', queue)
})
