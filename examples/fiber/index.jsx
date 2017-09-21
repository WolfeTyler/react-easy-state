import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const start = Date.now()

function update () {
  ReactDOM.render(<App elapsed={Date.now() - start} />, document.getElementById('react-root'))
  requestAnimationFrame(update)
}

requestAnimationFrame(update)
