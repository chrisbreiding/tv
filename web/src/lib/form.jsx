import React, { Component } from 'react';

export class Input extends Component {
  render () {
    return <input ref="input" {...this.props} />;
  }

  getValue () {
    return this.refs.input.value;
  }
}

export class AutoFocusedInput extends Input {
  componentDidMount () {
    this.refs.input.focus();
    this._moveCursorToEnd(this.refs.input);
  }

  _moveCursorToEnd (domNode) {
    if (!domNode.setSelectionRange) { return; }
    domNode.setSelectionRange(domNode.value.length, domNode.value.length);
  }
}
