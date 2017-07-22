import React from "react"
import PropTypes from "prop-types"
import drawCalendar from "./draw"

export default class Calendar extends React.Component {
  constructor(props) {
    super(props)
    this.updateCanvas = this.updateCanvas.bind(this)
    this.onClick = this.onClick.bind(this)
    this.state = {
      zoomProgress: 0,
    }
  }

  componentDidUpdate() {
    this.updateCanvas()
  }

  componentDidMount() {
    this.updateCanvas()
    window.addEventListener("resize", this.updateCanvas)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateCanvas)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedYear !== this.props.selectedYear) {
      const ANIMATION_DURATION = 9000
      const now = window.performance.now()

      const tick = (newNow) => {
        const zoomProgress = (newNow - now) / ANIMATION_DURATION
        console.log("TICK", zoomProgress)
        if (zoomProgress > 1) return this.setState({zoomProgress: 1})

        this.setState({zoomProgress})
        requestAnimationFrame(tick)
      }

      requestAnimationFrame(tick)
    }
  }

  updateCanvas() {
    const deviceDisplayScale = window.devicePixelRatio || 1
    const width = this.canvas.offsetWidth * deviceDisplayScale
    const height = this.canvas.offsetHeight * deviceDisplayScale
    this.canvas.width = width
    this.canvas.height = height

    const ctx = this.canvas.getContext("2d")

    ctx.save()
    ctx.clearRect(0, 0, width, height)

    drawCalendar({ctx, width, height, weeks: this.props.weeks, selectedYear: this.props.selectedYear, zoomProgress: this.state.zoomProgress})

    ctx.restore()
  }

  onClick(e) {
    console.log("clicked", e)
    this.props.select(26)
  }

  render() {
    const canZoom = this.state.zoomProgress === 0

    return (
      <canvas
        ref={(canvas) => { this.canvas = canvas }}
        style={{width: "100%", height: "100%", pointerEvents: canZoom ? "auto" : "none", cursor: canZoom ? "pointer" : "default"}}
        onClick={this.onClick}
      />
    )
  }
}

Calendar.propTypes = {
  weeks: PropTypes.any.isRequired,
  selectedYear: PropTypes.number,
  select: PropTypes.func.isRequired,
}
