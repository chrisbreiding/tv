import { faCircleMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import stats from '../lib/stats'
import Modal from '../modal/modal'
import { AutoFocusedInput } from '../lib/form'
import { deleteShow, updateShow } from '../shows/shows-api'
import showsStore from '../shows/shows-store'

const EditShow = observer(() => {
  const [confirmDeletion, setConfirmDeletion] = useState()
  const displayNameRef = useRef()
  const searchNameRef = useRef()
  const fileNameRef = useRef()

  const { id } = useParams()
  const navigate = useNavigate()

  const show = showsStore.getShowById(id)

  if (!show) return null

  useEffect(() => {
    stats.send('Edit Show', {
      showId: show.id,
      showName: show.displayName,
    })
  }, [true])

  const askForConfirmation = (e) => {
    e.preventDefault()
    setConfirmDeletion(true)
  }

  const confirmDelete = () => {
    deleteShow(show)
    close()
  }

  const cancelDelete = () => {
    setConfirmDeletion(false)
  }

  const save = (e) => {
    e.preventDefault()

    updateShow({
      id: show.id,
      displayName: displayNameRef.current.value,
      searchName: searchNameRef.current.value,
      fileName: fileNameRef.current.value,
    })
    close()
  }

  const close = () => {
    navigate('/')
  }

  return (
    <div className="show-edit">
      <Modal className="show-edit-modal">
        <Modal.Header />
        <Modal.Content>
          <form className="form" onSubmit={save}>
            <fieldset>
              <label>Display Name</label>
              <AutoFocusedInput ref={displayNameRef} defaultValue={show.displayName} />
            </fieldset>

            <fieldset>
              <label>Search Name</label>
              <input ref={searchNameRef} defaultValue={show.searchName} />
            </fieldset>

            <fieldset>
              <label>File Name</label>
              <input ref={fileNameRef} defaultValue={show.fileName} />
            </fieldset>

            <button className="hide">Hidden here so submit on enter works</button>
          </form>
        </Modal.Content>
        <Modal.Footer okText="Save" onOk={save} onCancel={close}>
          <a className="delete" onClick={askForConfirmation} href="#">
            <FontAwesomeIcon icon={faCircleMinus} /> Delete show
          </a>
        </Modal.Footer>
      </Modal>

      {confirmDeletion && (
        <Modal className='confirm-delete-modal'>
          <Modal.Content>
            <p>Delete {show.displayName}?</p>
          </Modal.Content>
          <Modal.Footer okText="Delete" onOk={confirmDelete} onCancel={cancelDelete} />
        </Modal>
      )}
    </div>
  )
})

export default EditShow
