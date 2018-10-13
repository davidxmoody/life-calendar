import * as express from "express"
import {getWeekData, getOverviewData} from "./get-week-data"

const DIARY_DIR = process.env.DIARY_DIR
if (!DIARY_DIR) {
  throw new Error("DIARY_DIR env var is not set")
}

const app = express()

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  next()
})

app.get("/weeks/:date", async (req, res) => {
  const data = await getWeekData(DIARY_DIR, req.params.date)
  res.send(data)
})

app.get("/overview", async (req, res) => {
  const data = await getOverviewData(DIARY_DIR)
  res.send(data)
})

app.listen(3001, "localhost", () => {
  console.log("Listening on port 3001")
})
