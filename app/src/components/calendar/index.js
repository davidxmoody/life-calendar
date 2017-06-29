import React, {PropTypes} from "react"
import drawCalendar from "./draw"

export default class Calendar extends React.Component {
  static propTypes = {
    weeks: PropTypes.any.isRequired,
  }

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
    const deviceDisplayScale = window.devicePixelRatio || 1
    const width = this.canvas.offsetWidth * deviceDisplayScale
    const height = this.canvas.offsetHeight * deviceDisplayScale
    this.canvas.width = width
    this.canvas.height = height

    const ctx = this.canvas.getContext("2d")

    ctx.save()
    ctx.clearRect(0, 0, width, height)

    drawCalendar({ctx, width, height, weeks: this.props.weeks})

    ctx.restore()
  }

  render() {
    return (
      <canvas
        ref={(canvas) => {this.canvas = canvas}}
        style={{width: "100%", height: "100%"}}
      />
    )
  }
}
