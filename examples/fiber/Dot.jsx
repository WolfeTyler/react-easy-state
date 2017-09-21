import React, { Component } from 'react'
import { easyComp, priorities } from 'react-easy-state'

class Dot extends Component {
  priority = priorities.HIGH
  store = { hover: false }

  handleMouseEnter () {
    this.store.hover = true
  }

  handleMouseLeave () {
    this.store.hover = false
  }

  render () {
    const { x, y, size, text } = this.props
    const { hover } = this.store

    const s = size * 1.3

    const base = {
      position: `absolute`,
      background: `#61dafb`,
      font: `normal 15px sans-serif`,
      textAlign: `center`,
      cursor: `pointer`
    }

    const style = {
      ...base,
      width: `${s}px`,
      height: `${s}px`,
      left: `${x}px`,
      top: `${y}px`,
      borderRadius: `${s / 2}px`,
      lineHeight: `${s}px`,
      background: hover ? `#ff0` : base.background
    }

    return (
      <div
        style={style}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {hover ? `*${text}*` : text}
      </div>
    )
  }
}

export default easyComp(Dot)
