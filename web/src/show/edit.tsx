import { faCircleMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { sendStats } from '../data/remote'
import { AutoFocusedInput } from '../lib/form'
import { Modal, ModalContent, ModalFooter, ModalHeader } from '../modal/modal'
import { deleteShow, updateShow } from '../shows/shows-api'
import { showsStore } from '../shows/shows-store'

export const EditShow = observer(() => {
  const [confirmingDeletion, setConfirmingDeletion] = useState(false)
  const displayNameRef = useRef<HTMLInputElement>(null)
  const searchNameRef = useRef<HTMLInputElement>(null)
  const fileNameRef = useRef<HTMLInputElement>(null)

  const { id } = useParams() as { id: string }
  const navigate = useNavigate()

  const show = showsStore.getShowById(id)

  if (!show) return null

  useEffect(() => {
    sendStats('Edit Show', {
      showId: show.id,
      showName: show.displayName,
    })
  }, [true])

  const askForConfirmation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setConfirmingDeletion(true)
  }

  const confirmDelete = () => {
    deleteShow(show)
    close()
  }

  const cancelDelete = () => {
    setConfirmingDeletion(false)
  }

  const save = () => {
    updateShow({
      id: show.id,
      displayName: displayNameRef.current!.value,
      searchName: searchNameRef.current!.value,
      fileName: fileNameRef.current!.value,
    })
    close()
  }

  const close = () => {
    navigate('..')
  }

  return (
    <>
      <Modal className="show-edit-modal">
        <ModalHeader />
        <ModalContent>
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
        </ModalContent>
        <ModalFooter okText="Save" onOk={save} onCancel={close}>
          <a className="delete" onClick={askForConfirmation} href="#">
            <FontAwesomeIcon icon={faCircleMinus} /> Delete show
          </a>
        </ModalFooter>
      </Modal>

      {confirmingDeletion && (
        <Modal className='confirm-delete-modal'>
          <ModalContent>
            <p>Delete <em>{show.displayName}</em>?</p>
          </ModalContent>
          <ModalFooter okText="Delete" onOk={confirmDelete} onCancel={cancelDelete} />
        </Modal>
      )}
    </>
  )
})
