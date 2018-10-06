import * as React from "react"
import {Entry} from "src/types"
import fetchEntriesForWeek from "src/fetchEntriesForWeek"
import EntryComponent from "src/components/Entry"

interface Props {
  selectedWeekStart: string | null
}

interface State {
  loading: boolean
  error: boolean
  entries: Entry[] | null
}

export default class WeekSummary extends React.PureComponent<Props, State> {
  public state: State = {
    loading: false,
    error: false,
    entries: null,
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.selectedWeekStart &&
      nextProps.selectedWeekStart !== this.props.selectedWeekStart
    ) {
      this.setState({loading: true, error: false, entries: null})
      fetchEntriesForWeek(nextProps.selectedWeekStart)
        .then((entries: Entry[]) =>
          this.setState({loading: false, error: false, entries}),
        )
        .catch((e: any) => {
          console.warn(e)
          this.setState({loading: false, error: true, entries: null})
        })
    }
  }

  public render() {
    return (
      <div>
        <pre style={{whiteSpace: "pre-wrap"}}>
          {JSON.stringify(this.props, null, 2)}
          loading: {JSON.stringify(this.state.loading, null, 2)}
          error: {JSON.stringify(this.state.error, null, 2)}
        </pre>
        {this.state.entries ? (
          <div>
            {this.state.entries.map((entry, index) => (
              <EntryComponent key={index} entry={entry} />
            ))}
          </div>
        ) : null}
      </div>
    )
  }
}
