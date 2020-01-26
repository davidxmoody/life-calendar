import * as React from "react"
import moment from "moment"
import {Entry, fetchWeekEntries} from "../hooks/useWeekEntries"
import {useState, useEffect} from "react"
import {
  ExpansionPanel,
  Typography,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from "@material-ui/core"
import {prettyFormatDate} from "../helpers/dates"
import {Link} from "wouter"

interface WeekSummaryData {
  weekStart: string
  entries: Entry[]
}

interface Props {
  setHighlightedWeekStart: (weekStart: string) => void
}

export default function Summaries(props: Props) {
  const [summaries, setSummaries] = useState<WeekSummaryData[]>([])

  useEffect(() => {
    const dates = getSomeDates()
    Promise.all(
      dates.map(async weekStart => ({
        weekStart,
        entries: await fetchWeekEntries(weekStart),
      })),
    ).then(data => setSummaries(data))
  }, [])

  return (
    <div>
      {summaries.map(s => (
        <ShortSummary
          {...s}
          onMouseEnter={() => props.setHighlightedWeekStart(s.weekStart)}
        />
      ))}
    </div>
  )
}

function ShortSummary(props: WeekSummaryData & {onMouseEnter: () => void}) {
  const textSummaries = props.entries
    .map(entry =>
      ("content" in entry ? entry.content : "")
        .split("\n")
        .filter(x => x.startsWith("##")),
    )
    .filter(x => x.length > 0)

  return (
    <ExpansionPanel defaultExpanded={true} onMouseEnter={props.onMouseEnter}>
      <ExpansionPanelSummary
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{prettyFormatDate(props.weekStart)}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div>
          {textSummaries.map((lines, index) => (
            <Link href={`/weeks/${props.weekStart}`}>
              <div
                style={{
                  display: "block",
                  border: "1px solid grey",
                  borderRadius: 3,
                  padding: 8,
                  marginBottom: index === textSummaries.length - 1 ? 0 : 16,
                  cursor: "pointer",
                  minWidth: 350,
                }}
              >
                {lines.map(line => (
                  <div style={{lineHeight: 1.4}}>{line}</div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

function getSomeDates() {
  const dates: string[] = []
  let weekStart = moment()
    .startOf("isoWeek")
    .format("YYYY-MM-DD")

  while (dates.length < 20) {
    dates.push(weekStart)
    weekStart = moment(weekStart)
      .subtract(1, "week")
      .format("YYYY-MM-DD")
  }

  return dates
}
