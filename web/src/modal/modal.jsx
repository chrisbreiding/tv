import React, { Component } from 'react'

const Header = ({ children, onClose }) => (
  <header>
    {children}
    {onClose && (
      <button className="close" title="Close" onClick={onClose}>
        <i className="fa fa-times"></i>
      </button>
    )}
  </header>
)

const Content = ({ children }) => (
  <main>
    {children}
  </main>
)

const Footer = ({ children, onCancel, onOk }) => (
  <footer>
    {children}
    <div className="controls">
      {onCancel && (
        <button className="cancel" onClick={onCancel}>Cancel</button>
      )}
      {onOk && (
        <button className="ok" onClick={onOk}>OK</button>
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
