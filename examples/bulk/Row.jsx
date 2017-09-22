import React, { Component } from 'react'
import { easyComp, priorities } from 'react-easy-state'
import IntersectionObserver from 'react-intersection-observer'
import store from './store'

class Row extends Component {
  priority = priorities.HIGH

  onDelete () {
    store.delete(this.props.row)
  }

  onClick () {
    store.select(this.props.row)
  }

  onVisibilityChange (isVisible) {
    if (isVisible) {
      this.priority = priorities.CRITICAL
    } else {
      this.priority = priorities.HIGH
    }
  }

  render () {
    const { row } = this.props
    const styleClass = row.selected ? 'danger' : ''

    return (
      <IntersectionObserver onChange={this.onVisibilityChange} tag='tr' className={styleClass}>
        <td className='col-md-1'>{row.id}</td>
        <td className='col-md-4'>
          <a onClick={this.onClick}>{row.label}</a>
        </td>
        <td className='col-md-1'><a onClick={this.onDelete}><span className='glyphicon glyphicon-remove' aria-hidden='true' /></a></td>
        <td className='col-md-6' />
      </IntersectionObserver>
    )
  }
}

export default easyComp(Row)
