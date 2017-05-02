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
    window.addEventListener("resize", this.updateCanvas)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateCanvas)
  }

  updateCanvas() {
    console.log("update canvas")
    const ctx = this.canvas.getContext("2d")
    const {width, height} = this.canvas

    ctx.save() // Save here to prevent the scale operations accumulating
    ctx.clearRect(0, 0, width, height)

    drawCalendar({ctx, width, height, weeks: this.props.weeks})

    ctx.restore()
  }

  render() {
    const width = 600
    const height = 900
    const deviceDisplayScale = window.devicePixelRatio || 1

    return (
      <canvas
        ref={(canvas) => { this.canvas = canvas }}
        width={width * deviceDisplayScale}
        height={height * deviceDisplayScale}
        style={{width, height}}
      />
    )
  }
}
