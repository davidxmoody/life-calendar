import * as React from "react"
import * as moment from "moment"
import Calendar from "./components/Calendar"
import lifeData from "./lifeData"
import generateCalendarData from "./generateCalendarData"

interface State {
  currentDate: string
  birthDate: string
  deathDate: string
  eras: any
}

export default class App extends React.Component<{}, State> {
  public state: State = {
    currentDate: moment().format("YYYY-MM-DD"),
    birthDate: lifeData.birthDate,
    deathDate: lifeData.deathDate,
    eras: lifeData.eras,
  }

  public render() {
    const calendarData = generateCalendarData(this.state)

    return (
      <div>
        <Calendar data={calendarData} />
      </div>
    )
  }
}
