import React, { Component } from 'react'
import { easyComp } from 'react-easy-state'
import Dot from './Dot'

class Triangle extends Component {
  render () {
    let { x, y, s, children } = this.props
    const targetSize = 25

    if (s <= targetSize) {
      return (
        <Dot
          x={x - (targetSize / 2)}
          y={y - (targetSize / 2)}
          size={targetSize}
          text={children}
        />
      )
    }

    s /= 2

    return (
      <div>
        <Triangle x={x} y={y - (s / 2)} s={s}>
          {children}
        </Triangle>

        <Triangle x={x - s} y={y + (s / 2)} s={s}>
          {children}
        </Triangle>

        <Triangle x={x + s} y={y + (s / 2)} s={s}>
          {children}
        </Triangle>
      </div>
    )
  }
}

export default easyComp(Triangle)
