import React, { createClass } from 'react'

export default createClass({

  componentDidMount () {
    document.body.className += 'modal-dialog-present'
  },

  componentWillUnmount () {
    document.body.className = ''
  },

  render () {
    return (
      <div className={`modal-dialog-overlay ${this.props.className}`}>
        <div className="modal-dialog">
          <header>
            {this.props.headerContent}
            {this._closeButton()}
          </header>
          <div className="modal-dialog-content">
            {this.props.children}
          </div>
          <footer>
            {this.props.footerContent}
            <div className="modal-controls">
              {this._cancelButton()}
              {this._okButton()}
            </div>
          </footer>
        </div>
      </div>
    )
  },

  _cancelButton () {
    if (!this.props.onCancel) { return null }

    return <button className="cancel" onClick={this.props.onCancel}>Cancel</button>
  },

  _okButton () {
    if (!this.props.onOk) { return null }

    return <button className="ok" onClick={this.props.onOk}>OK</button>
  },

  _closeButton () {
    if (!this.props.onClose) { return null }

    return (
      <button className="close" title="Close" onClick={this.props.onClose}>
        <i className="fa fa-times"></i>
      </button>
    )
  },
})
