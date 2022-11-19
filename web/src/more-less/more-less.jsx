import React, { Children, Component } from 'react'

export default class MoreLess extends Component {
  constructor (props) {
    super(props)

    this.state = { collapsed: true }
  }

  render () {
    const { children, threshold } = this.props
    const beyondThreshold = this._beyondThreshold()

    return (
      <ul className={this.props.className}>
        {this._beyondThreshold() && this.state.collapsed ? Children.toArray(children).slice(0, threshold) : children}
        {this._button(beyondThreshold)}
      </ul>
    )
  }

  _beyondThreshold () {
    const { children, threshold } = this.props
    return threshold && Children.count(children) > threshold
  }

  _button (beyondThreshold) {
    if (!beyondThreshold) { return null }

    const { collapsed } = this.state

    return (
      <li className="more-less">
        <a href="#" onClick={this._toggle}>
          <i className={`fa fa-caret-${collapsed ? 'down' : 'up'}`} />
          {collapsed ? 'more' : 'less'}
        </a>
      </li>
    )
  }

  _toggle = (e) => {
    e.preventDefault()

    this.setState({
      collapsed: !this.state.collapsed,
    })

    e.target.blur()
  }
}
