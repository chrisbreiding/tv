import { faCircleMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'

import stats from '../lib/stats'
import Modal from '../modal/modal'
import { AutoFocusedInput, Input } from '../lib/form'
import { deleteShow, updateShow } from '../shows/shows-api'
import showsStore from '../shows/shows-store'
import { withRouter } from '../lib/with-router'

class EditShow extends Component {
  constructor (props) {
    super(props)

    this.state = { confirmDeletion: false }
  }

  componentDidMount () {
    const show = showsStore.getShowById(this.props.params.id)
    stats.send('Edit Show', {
      showId: show.id,
      showName: show.displayName,
    })
  }

  render () {
    const show = this.show = showsStore.getShowById(this.props.params.id)
    if (!show) return null

    return (
      <div className="show-edit">
        <Modal className="show-edit-modal">
          <Modal.Header />
          <Modal.Content>
            <form className="form" onSubmit={this._save}>
              <fieldset>
                <label>Display Name</label>
                <AutoFocusedInput ref="displayName" defaultValue={show.displayName} />
              </fieldset>

              <fieldset>
                <label>Search Name</label>
                <Input ref="searchName" defaultValue={show.searchName} />
              </fieldset>

              <fieldset>
                <label>File Name</label>
                <Input ref="fileName" defaultValue={show.fileName} />
              </fieldset>

              <button className="hide">Hidden here so submit on enter works</button>
            </form>
          </Modal.Content>
          <Modal.Footer okText="Save" onOk={this._save} onCancel={this._cancel}>
            <a className="delete" onClick={this._askForConfirmation} href="#">
              <FontAwesomeIcon icon={faCircleMinus} /> Delete show
            </a>
          </Modal.Footer>
        </Modal>
        {this._confirmation()}
      </div>
    )
  }

  _askForConfirmation = (e) => {
    e.preventDefault()
    this.setState({ confirmDeletion: true })
  }

  _confirmation = () => {
    if (!this.state.confirmDeletion) return null

    return (
      <Modal className='confirm-delete-modal'>
        <Modal.Content>
          <p>Delete {this.show.displayName}?</p>
        </Modal.Content>
        <Modal.Footer okText="Delete" onOk={this._confirmDelete} onCancel={this._cancelDelete} />
      </Modal>
    )
  }

  _confirmDelete = () => {
    deleteShow(this.show)
    this._close()
  }

  _cancelDelete = () => {
    this.setState({ confirmDeletion: false })
  }

  _save = (e) => {
    e.preventDefault()

    updateShow({
      id: this.show.id,
      displayName: this.refs.displayName.value,
      searchName: this.refs.searchName.value,
      fileName: this.refs.fileName.value,
    })
    this._close()
  }

  _cancel = () => {
    this._close()
  }

  _close = () => {
    this.props.navigate('/')
  }
}

export default withRouter(EditShow)
