import * as express from "express"
import {getWeekData, getRandomEntries} from "./get-week-data"
import {LISTEN_PORT} from "./config"
import {getLayersList, getLayerData} from "./db/layers"

const app = express()

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  next()
})

app.get("/weeks/:date", async (req, res) => {
  const weekData = await getWeekData(req.params.date)
  res.send(weekData)
})

app.get("/layers", async (req, res) => {
  const layers = getLayersList()
  res.send(layers)
})

app.get("/layers/:layerName", async (req, res) => {
  const layerData = getLayerData(req.params.layerName)
  res.send(layerData)
})

app.get("/random", async (req, res) => {
  const entries = getRandomEntries({
    limit: parseInt(req.query.limit, 10) || 20,
    from: req.query.from,
    to: req.query.to,
  })
  res.send(entries)
})

app.listen(LISTEN_PORT, "localhost", () => {
  console.log(`Listening on port ${LISTEN_PORT}`)
})
