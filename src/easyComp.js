import { Component } from 'react'
import { observable, unobserve, observe, queue, setPriority } from '@nx-js/observer-util'
import autoBind from './autoBind'

const REACTIVE_RENDER = Symbol('reactive render')
const PRIORITY = Symbol('reactive render priority')

export default function easyComp (Comp) {
  if (typeof Comp !== 'function') {
    throw new TypeError('easyComp expects a component as argument.')
  }

  // wrap stateless components in a class
  if (isStatelessComp(Comp)) {
    Comp = statelessToStatefulComp(Comp)
  } else if (hasComponentShouldUpdate(Comp)) {
    // shouldComponentUpdate is optimized by easyState, overwriting it would add zero or less value
    throw new Error(
      'easyState optimizes shouldComponentUpdate, do not implement it.'
    )
  }

  return toReactiveComp(Comp)
}

function isStatelessComp (Comp) {
  return (
    !(Comp.prototype && Comp.prototype.render) && !Component.isPrototypeOf(Comp)
  )
}

function statelessToStatefulComp (StatelessComp) {
  return class StatefulComp extends Component {
    // proxy react specific static variables to the stateful component
    // from the stateless component
    static displayName = StatelessComp.displayName || StatelessComp.name;
    static contextTypes = StatelessComp.contextTypes;
    static propTypes = StatelessComp.propTypes;
    static defaultProps = StatelessComp.defaultProps;

    // call the original function component inside the render method
    render () {
      return StatelessComp.call(this, this.props, this.context)
    }
  }
}

function hasComponentShouldUpdate (Comp) {
  return typeof Comp.prototype.shouldComponentUpdate === 'function'
}

function toReactiveComp (Comp) {
  // return a HOC which overwrites render, shouldComponentUpdate and componentWillUnmount
  // it decides when to run the new reactive methods and when to proxy to the original methods
  return class EasyHOC extends Comp {
    // proxy react specific static variables to the HOC from the component
    static displayName = Comp.displayName || Comp.name;
    static contextTypes = Comp.contextTypes;
    static propTypes = Comp.propTypes;
    static defaultProps = Comp.defaultProps;

    constructor (props) {
      super(props)

      // save the starting priority internally
      // priority is replaced with a getter/setter pair after this
      this[PRIORITY] = this.priority

      // auto bind non react specific original methods to the component instance
      autoBind(this, Comp.prototype, true)

      // turn the store into an observable object, which triggers rendering on mutations
      if (typeof this.store === 'object' && this.store !== null) {
        this.store = observable(this.store)
      } else if ('store' in this) {
        throw new TypeError('component.store must be an object')
      }
    }

    get priority () {
      return this[PRIORITY]
    }

    set priority (priority) {
      this[PRIORITY] = priority
      if (this[REACTIVE_RENDER]) {
        setPriority(this[REACTIVE_RENDER], priority)
      }
    }

    render () {
      // if it is the first direct render from react call there is no reactive render yet
      if (!this[REACTIVE_RENDER]) {
        let result = null
        // create a reactive render, which is automatically called by easyState on relevant store mutations
        // the passed function is executed right away synchronously once by easyState
        this[REACTIVE_RENDER] = observe(() => {
          // if it is the first (synchronous) execution, call the original component's render
          // this is necessary because forceUpdate can not be called synchronously inside render functions
          if (!this[REACTIVE_RENDER]) {
            result = super.render()
          } else {
            // if it is a later reactive, asynchronous execution - triggered by easyState - forceUpdate the original component
            // this is necessary, because calling render would require the result to be returned
            // which is not possible from this asynchronous context
            super.forceUpdate()
          }
        }, this.priority)
        // return the result from super.render() inside the reactive render on the first render execution
        return result
      } else {
        // return the original component's render result on direct calls from react
        return super.render()
      }
    }

    componentWillReceiveProps (nextProps) {
      const { props } = this
      const keys = Object.keys(props)
      const nextKeys = Object.keys(nextProps)

      // component should update if the number of its props changed
      if (keys.length !== nextKeys.length) {
        return queue(this[REACTIVE_RENDER])
      }

      // component should update if any of its props changed value
      for (let key of keys) {
        if (props[key] !== nextProps[key]) {
          return queue(this[REACTIVE_RENDER])
        }
      }
    }

    // react should trigger updates on prop changes, while easyState handles store changes
    shouldComponentUpdate (nextProps) {
      // do not let react update the comp otherwise, leave store triggered updates to easyState
      return false
    }

    componentWillUnmount () {
      // clean up memory used by easyState
      unobserve(this[REACTIVE_RENDER])

      // also call user defined componentWillUnmount to allow the user
      // to clean up additional memory
      if (super.componentWillUnmount) {
        super.componentWillUnmount()
      }
    }
  }
}
