import React, { Children, cloneElement, Component, PropTypes } from 'react'
import { getWindowScrollTop, getWindowHeight } from 'html-utilities'
import _ from 'lodash'


const EVENTS = ['resize', 'scroll']

export default class LazyLoadingTable extends Component {

  static propTypes = {
    children: PropTypes.array.isRequired,
    className: PropTypes.string,
    elementHeight: PropTypes.number.isRequired,
    injectedPropName: PropTypes.string
  };

  constructor() {
    super()
    this.onWindowPositionChange = this.onWindowPositionChange.bind(this)
    this.state = {
      itemInViewCount: 0,
      headItemInViewIndex: Number.MAX_VALUE
    }
    this.lockEventHanlder = false
  }


  componentDidMount() {
    EVENTS.forEach(e =>
      document.addEventListener(e, this.onWindowPositionChange, false)
    )
  }

  componentWillUnmount() {
    EVENTS.forEach(e =>
      document.removeEventListener(e, this.onWindowPositionChange, false)
    )
  }

  onWindowPositionChange() {
    // Restrict the frequency of props changes
    if (!this.lockEventHanlder) {
      this.lockEventHanlder = true
      setTimeout(() => {
        this.lockEventHanlder = false
      }, 100)
    } else return

    const { elementHeight } = this.props,
      containerOffset = this.refs.container.offsetTop,
      windowScrollTop = getWindowScrollTop(),
      windowHeight = getWindowHeight(),
      elementCount = this.props.children.length,
      containerTailOffset = containerOffset + elementCount * elementHeight,
      tableOutOfView = windowScrollTop + windowHeight < containerOffset ||
        containerTailOffset < windowScrollTop

    let headItemInViewIndex = Number.MAX_VALUE
    let itemInViewCount = 0
    if (!tableOutOfView) {
      let containerInViewHeight = 0

      //haven't fully scroll to container's top
      if (windowScrollTop <= containerOffset) {
        headItemInViewIndex = 0
        containerInViewHeight = windowHeight -
          (containerOffset - windowScrollTop)
      } else {
        const passedDistance = windowScrollTop - containerOffset
        headItemInViewIndex = Math.floor(passedDistance / elementHeight)
        const onlyContainerInView =
          windowScrollTop + windowHeight < containerTailOffset
        containerInViewHeight = onlyContainerInView ?
          windowHeight : containerTailOffset - windowScrollTop
      }
      itemInViewCount = Math.ceil(containerInViewHeight / elementHeight)
    }
    this.setState({ headItemInViewIndex, itemInViewCount })
  }

  render() {
    const {
      children,
      className,
      injectedPropName
    } = this.props

    const { itemInViewCount, headItemInViewIndex: index } = this.state

    const childrenWithProps = Children.map(children,
     (child, i) => cloneElement(child, {
       [ injectedPropName ? injectedPropName : 'display' ]:
       _.inRange(i, index - 1, index + itemInViewCount)
     })
    )

    return (
      <div className={className} ref='container'>
        { childrenWithProps }
      </div>
    )
  }
}
