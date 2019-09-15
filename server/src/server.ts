import * as express from "express"
import {LISTEN_PORT} from "./config"
import {getLayersList, getLayerData} from "./db/layers"
import {getDaysForWeek, getRandomDays} from "./date-helpers"
import {getEntriesForDays} from "./db/entries"

const app = express()

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  next()
})

app.get("/layers", async (req, res) => {
  const layers = getLayersList()
  res.send(layers)
})

app.get("/layers/:layerName", async (req, res) => {
  const layerData = getLayerData(req.params.layerName)
  if (!layerData) {
    res.sendStatus(404)
  } else {
    res.send(layerData)
  }
})

app.get("/weeks/:date", async (req, res) => {
  const days = getDaysForWeek(req.params.date)
  const entries = getEntriesForDays(days)
  res.send(entries)
})

app.get("/random", async (req, res) => {
  const days = getRandomDays({
    limit: parseInt(req.query.limit, 10) || undefined,
    from: req.query.from,
    to: req.query.to,
  })
  const entries = getEntriesForDays(days)
  res.send(entries)
})

app.listen(LISTEN_PORT, "localhost", () => {
  console.log(`Listening on port ${LISTEN_PORT}`)
})
