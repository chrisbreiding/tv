import { observable } from 'mobx'

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
    this.state = props.state
    this.episode = props.episode

    if (props.info) this.info = props.info
    if (props.items) this.items = props.items
  }
}

export const states = {
  SELECT_TORRENT: 'SELECT_TORRENT',
  DOWNLOADING_TORRENT: 'DOWNLOADING_TORRENT',
  SELECT_FILE: 'SELECT_FILE',
  FINISHED: 'FINISHED',
  CANCELED: 'CANCELED',
  FAILED: 'FAILED',
}

export default QueueItemModel
