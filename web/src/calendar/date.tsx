import React from 'react'
import { observer } from 'mobx-react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { Modal, ModalContent, ModalHeader } from '../modal/modal'
import dayjs from 'dayjs'
import { Shows } from '../shows/shows'
import { showsStore } from '../shows/shows-store'

export const Date = observer(() => {
  const { date: dateString } = useParams() as { date: string }
  const navigate = useNavigate()

  const date = dayjs(dateString)

  return (
    <>
      <Modal className='date-shows'>
        <ModalHeader onClose={() => navigate('..')}>
          <h2>{date.format('MMMM D, YYYY')}</h2>
        </ModalHeader>
        <ModalContent>
          <Shows
            emptyMessage='No shows for date'
            shows={showsStore.getShowsForDate(date)}
          />
        </ModalContent>
      </Modal>
      <Outlet />
    </>
  )
})
