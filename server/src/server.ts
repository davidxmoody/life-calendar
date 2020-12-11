import * as express from "express"
import {LISTEN_PORT, DIARY_DIR} from "./config"
import {getLayers} from "./db/layers"
import {getDaysForWeek, getDaysInRange} from "./date-helpers"
import {getEntriesForDays, getEntriesModifiedSince} from "./db/entries"
import {join} from "path"

const app = express()

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  next()
})

app.use("/scanned", express.static(join(DIARY_DIR, "scanned")))
app.use("/audio", express.static(join(DIARY_DIR, "audio")))

app.get("/layers", async (_req, res) => {
  const layers = getLayers()
  res.send(layers)
})

app.get("/weeks/:date", async (req, res) => {
  const days = getDaysForWeek(req.params.date)
  const entries = getEntriesForDays(days)
  res.send(entries)
})

app.get("/entries", async (req, res) => {
  const from = req.query.from as string
  const to = req.query.to as string

  if (!from || !to) {
    res.sendStatus(400)
    return
  }

  const days = getDaysInRange(from, to)
  const entries = getEntriesForDays(days)
  res.send(entries)
})

app.get("/entries-since", async (req, res) => {
  const since = parseInt(req.query.since as string, 10)

  const entries = await getEntriesModifiedSince(since)
  res.send(entries)
})

app.listen(LISTEN_PORT, "localhost", () => {
  console.log(`Listening on port ${LISTEN_PORT}`)
})
