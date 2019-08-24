import * as express from "express"
import {getWeekData, getOverviewData} from "./get-week-data"
import * as testLayer1 from "./test-layer-data-1.json"
import * as testLayer2 from "./test-layer-data-2.json"
import * as testLayer3 from "./test-layer-data-3.json"
import * as testLayer4 from "./test-layer-data-4.json"
import {LISTEN_PORT} from "./config"

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

app.get("/layers/test1", async (req, res) => {
  res.send(testLayer1)
})

app.get("/layers/test2", async (req, res) => {
  res.send(testLayer2)
})

app.get("/layers/test3", async (req, res) => {
  res.send(testLayer3)
})

app.get("/layers/test4", async (req, res) => {
  res.send(testLayer4)
})

app.listen(LISTEN_PORT, "localhost", () => {
  console.log(`Listening on port ${LISTEN_PORT}`)
})
