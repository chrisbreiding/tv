import cs from 'classnames'
import { observer } from 'mobx-react'
import React, { useEffect, useRef } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import { sendStats } from '../data/remote'
import { AutoFocusedInput } from '../lib/form'
import { Modal, ModalContent, ModalHeader } from '../modal/modal'
import { searchStore } from './search-store'

export const Search = observer(() => {
  const queryRef = useRef<HTMLInputElement>(null)
  const { query } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    sendStats('Visit Search')
  }, [true])

  const search = (e: React.FormEvent) => {
    e.preventDefault()

    const query = queryRef.current?.value

    if (query) {
      sendStats('Search', { query })
    }

    navigate(query || '')
  }

  const close = () => {
    navigate('..')
  }

  return (
    <Modal className={cs('search', {
      'has-query': !!query,
      'has-results': !!searchStore.results.length,
    })}>
      <ModalHeader onClose={close}>
        <h2>Search Shows</h2>
        <form onSubmit={search}>
          <AutoFocusedInput ref={queryRef} defaultValue={query} />
          <button type="submit">Search</button>
        </form>
      </ModalHeader>
      <ModalContent>
        <Outlet />
      </ModalContent>
    </Modal>
  )
})
