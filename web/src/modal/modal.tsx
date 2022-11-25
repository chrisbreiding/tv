import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'

interface ModalHeaderProps {
  children?: React.ReactNode
  onClose?: () => void
}

export const ModalHeader = ({ children, onClose }: ModalHeaderProps) => (
  <header>
    {children}
    {onClose && (
      <div className="close">
        <button type="button" title="Close" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    )}
  </header>
)

interface ModalContentProps {
  children: React.ReactNode
}

export const ModalContent = ({ children }: ModalContentProps) => (
  <main>
    {children}
  </main>
)

interface ModalFooterProps {
  children?: React.ReactNode
  onCancel?: () => void
  onOk?: () => void
  okText?: string
}

export const ModalFooter = ({ children, onCancel, onOk, okText = 'OK' }: ModalFooterProps) => (
  <footer>
    {children}
    <div className="controls">
      {onCancel && (
        <button type="button" className="cancel" onClick={onCancel}>Cancel</button>
      )}
      {onOk && (
        <button type="button" className="ok" onClick={onOk}>{okText}</button>
      )}
    </div>
  </footer>
)

interface ModalProps {
  children: React.ReactNode
  className?: string
}

export const Modal = ({ children, className }: ModalProps) => {
  useEffect(() => {
    document.body.className += 'modal-dialog-present'

    return () => {
      document.body.className = ''
    }
  }, [true])

  return (
    <div className={`modal-dialog-overlay ${className || ''}`}>
      <div className="modal-dialog">
        {children}
      </div>
    </div>
  )
}
