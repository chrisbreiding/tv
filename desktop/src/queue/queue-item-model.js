import _ from 'lodash'
import { action, observable } from 'mobx'

const validProps = [
  'state',
  'episode',
  'info',
  'items',
  'onSelect',
  'onCancel',
]

class QueueItemModel {
  @observable id
  @observable state
  @observable episode
  @observable info
  @observable items = []
  @observable onSelect
  @observable onCancel

  constructor (props) {
    this.id = props.id
    this.update(props)
  }

  @action update (props) {
    _.each(validProps, (prop) => {
      if (props[prop] !== undefined) {
        this[prop] = props[prop]
      }
    })
  }
}

export const states = {
  SELECT_TORRENT: 'SELECT_TORRENT',
  SEARCHING_TORRENTS: 'SEARCHING_TORRENTS',
  ADDING_TORRENT: 'ADDING_TORRENT',
  DOWNLOADING_TORRENT: 'DOWNLOADING_TORRENT',
  SELECT_FILE: 'SELECT_FILE',
  FINISHED: 'FINISHED',
  CANCELED: 'CANCELED',
  FAILED: 'FAILED',
}

export default QueueItemModel
