import React, { Component } from 'react'
import { easyComp, priorities } from 'react-easy-state'
import Triangle from './Triangle'

class App extends Component {
  store = { seconds: 0 }

  componentDidMount () {
    this.invervalID = setInterval(this.tick, 1000)
  }

  tick () {
    this.store.seconds = (this.store.seconds % 10) + 1
  }

  componentWillUnmount () {
    clearInterval(this.intervalID)
  }

  render () {
    const { seconds } = this.store
    const { elapsed } = this.props

    const t = (elapsed / 1000) % 10
    const scale = 1 + (t > 5 ? 10 - t : t) / 10
    const transform = `scaleX(${scale / 2.1}) scaleY(0.7) translateZ(0.1px)`

    const containerStyle = {
      position: `absolute`,
      transformOrigin: `0 0`,
      left: `50%`,
      top: `50%`,
      width: `10px`,
      height: `10px`,
      background: `#eee`
    }

    return (
      <div style={{...containerStyle, transform}}>
        <Triangle x={0} y={0} s={1000}>{seconds}</Triangle>
      </div>
    )
  }
}

export default easyComp(App)
