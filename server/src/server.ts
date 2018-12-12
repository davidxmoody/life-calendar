import * as express from "express"
import {getWeekData, getOverviewData} from "./get-week-data"

const app = express()

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  next()
})

app.get("/weeks/:date", async (req, res) => {
  const data = await getWeekData(req.params.date)
  res.send(data)
})

app.get("/overview", async (req, res) => {
  const data = await getOverviewData()
  res.send(data)
})

app.listen(3001, "localhost", () => {
  console.log("Listening on port 3001")
})
