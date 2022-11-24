import cs from 'classnames'
import { observer } from 'mobx-react'
import React, { useEffect, useRef } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import stats from '../lib/stats'
import Modal from '../modal/modal'
import { AutoFocusedInput } from '../lib/form'
import searchStore from './search-store'

export default observer(() => {
  const queryRef = useRef()
  const { query } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    stats.send('Visit Search')
  }, [true])

  const search = (e) => {
    e.preventDefault()

    const query = queryRef.current.value

    stats.send('Search', { query })
    navigate(queryRef.current.value)
  }

  const close = () => {
    navigate('/')
  }

  return (
    <Modal className={cs('search', {
      'has-query': !!query,
      'has-results': !!searchStore.results.length,
    })}>
      <Modal.Header onClose={close}>
        <h2>Search Shows</h2>
        <form onSubmit={search}>
          <AutoFocusedInput ref={queryRef} defaultValue={query} />
          <button type="submit">Search</button>
        </form>
      </Modal.Header>
      <Modal.Content>
        <Outlet />
      </Modal.Content>
    </Modal>
  )
})
