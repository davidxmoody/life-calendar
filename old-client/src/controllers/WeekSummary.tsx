import * as React from "react"
import {Entry} from "src/types"
import fetchEntriesForWeek from "src/fetchEntriesForWeek"
import EntryComponent from "src/components/Entry"
import styled from "styled-components"

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
      this.setState({loading: true, error: false})
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
    const {loading, error, entries} = this.state

    if (!error && !loading && !entries) {
      return <Container />
    }

    if (error) {
      return <Container>Error</Container>
    }

    return (
      <Container loading={loading}>
        {entries ? (
          entries.length > 0 ? (
            <div>
              {entries.map((entry, index) => (
                <EntryComponent key={index} entry={entry} />
              ))}
            </div>
          ) : (
            <div>No entries</div>
          )
        ) : null}
      </Container>
    )
  }
}

const Container = styled.div<{loading?: boolean}>`
  transition: opacity 0.2s 0.1s;
  opacity: ${({loading}) => (loading ? 0.5 : 1)};
`
