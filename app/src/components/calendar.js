import React from "react"
import drawCalendar from "../drawing/draw-calendar"

export default class Calendar extends React.Component {
  constructor(props) {
    super(props)
    this.updateCanvas = this.updateCanvas.bind(this)
  }

  componentDidUpdate() {
    this.updateCanvas()
  }

  componentDidMount() {
    this.updateCanvas()
    // window.addEventListener("resize", this.updateCanvas)
  }

  componentWillUnmount() {
    // window.removeEventListener("resize", this.updateCanvas)
  }

  updateCanvas() {
    const ctx = this.canvas.getContext("2d")
    const {width, height} = this.canvas
    const {x, y, scale} = this.props

    ctx.save() // Save here to prevent the scale operations accumulating
    ctx.clearRect(0, 0, width, height)
    ctx.translate(0.5 * width, 0.5 * height)
    ctx.scale(scale, scale)
    ctx.translate((-x) * width, (-y) * height)

    // console.time("draw")
    drawCalendar({ctx, width, height, weeks: this.props.weeks})
    // console.timeEnd("draw")

    ctx.restore()
  }

  render() {
    const width = window.innerWidth
    const height = window.innerHeight
    const deviceDisplayScale = window.devicePixelRatio || 1
    const cursor = this.props.grabbing ? "-webkit-grabbing" : "-webkit-grab"

    return (
      <canvas
        ref={(canvas) => { this.canvas = canvas }}
        width={width * deviceDisplayScale}
        height={height * deviceDisplayScale}
        style={{width, height, cursor}}
      />
    )
  }
}
