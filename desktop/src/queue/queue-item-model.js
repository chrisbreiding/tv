import { observable } from 'mobx'

class QueueItemModel {
  @observable id
  @observable state
  @observable episode
  @observable info
  @observable torrents = []
  @observable files = []

  constructor (props) {
    this.id = props.id
    this.state = props.state
    this.episode = props.episode

    if (props.info) this.info = props.info
    if (props.torrents) this.torrents = props.torrents
    if (props.files) this.files = props.files
  }
}

export default QueueItemModel
