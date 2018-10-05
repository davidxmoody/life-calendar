import * as React from "react"

interface Props {
  selectedWeekStart: string | null
}

export default class WeekSummary extends React.PureComponent<Props> {
  public render() {
    return <div>{this.props.selectedWeekStart}</div>
  }
}
