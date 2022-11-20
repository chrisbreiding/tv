import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'

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

class Modal extends Component {
  static Header = Header
  static Content = Content
  static Footer = Footer

  componentDidMount () {
    document.body.className += 'modal-dialog-present'
  }

  componentWillUnmount () {
    document.body.className = ''
  }

  render () {
    return (
      <div className={`modal-dialog-overlay ${this.props.className || ''}`}>
        <div className="modal-dialog">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Modal
