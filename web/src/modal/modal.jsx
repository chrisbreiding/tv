import React, { createClass } from 'react';

export default createClass({

  componentDidMount () {
    document.body.className += 'modal-dialog-present';
  },

  componentWillUnmount () {
    document.body.className = '';
  },

  render () {
    return (
      <div className={`modal-dialog-overlay ${this.props.className}`}>
        <div className="modal-dialog">
          <div className="modal-dialog-content">
            {this.props.children}
            <footer>
              {this._cancelButton()}
              {this._okButton()}
            </footer>
          </div>
          {this._closeButton()}
        </div>
      </div>
    );
  },

  _cancelButton () {
    if (!this.props.onCancel) { return null; }

    return <button className="cancel" onClick={this.props.onCancel}>Cancel</button>;
  },

  _okButton () {
    if (!this.props.onOk) { return null; }

    return <button className="ok" onClick={this.props.onOk}>OK</button>;
  },

  _closeButton () {
    if (!this.props.onClose) { return null; }

    return (
      <button className="close" title="Close" onClick={this.props.onClose}>
        <i className="fa fa-times"></i>
      </button>
    );
  },
});
