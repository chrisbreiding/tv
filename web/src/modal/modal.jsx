import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'

const Header = ({ children, onClose }) => (
  <header>
    {children}
    {onClose && (
      <div className="close">
        <button title="Close" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    )}
  </header>
)

const Content = ({ children }) => (
  <main>
    {children}
  </main>
)

const Footer = ({ children, onCancel, onOk, okText = 'OK' }) => (
  <footer>
    {children}
    <div className="controls">
      {onCancel && (
        <button className="cancel" onClick={onCancel}>Cancel</button>
      )}
      {onOk && (
        <button className="ok" onClick={onOk}>{okText}</button>
      )}
    </div>
  </footer>
)

const Modal = ({ className, children }) => {
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

Modal.Header = Header
Modal.Content = Content
Modal.Footer = Footer

export default Modal
