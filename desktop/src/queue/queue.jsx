import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'

import queueApi from './queue-api'
import queueStore from './queue-store'

import Loader from '../lib/loader'
import QueueItem from './queue-item'

const Queue = observer(() => {
  if (queueStore.isLoading) {
    return (
      <main>
        <Loader message='Loading' />
      </main>
    )
  }

  if (!queueStore.size) {
    return (
      <main>
        <p className='empty'>No Items in Queue</p>
      </main>
    )
  }

  return (
    <main className='queue'>
      <ul>
        {_.map(queueStore.items, (queueItem) => (
          <QueueItem
            key={queueItem.id}
            queueItem={queueItem}
            onRemove={() => queueApi.remove(queueItem)}
          />
        ))}
      </ul>
    </main>
  )
})

export default Queue
