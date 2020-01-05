import * as express from "express"
import {LISTEN_PORT, DIARY_DIR} from "./config"
import {getLayerList, getLayerData} from "./db/layers"
import {getDaysForWeek, getRandomDays} from "./date-helpers"
import {getEntriesForDays} from "./db/entries"
import {join} from "path"

const app = express()

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  next()
})

app.use("/scanned", express.static(join(DIARY_DIR, "scanned")))

app.get("/layers", async (req, res) => {
  const layers = getLayerList()
  res.send(layers)
})

app.get("/layers/:subdir/:layerName", async (req, res) => {
  const layerData = getLayerData(req.params.subdir, req.params.layerName)
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
