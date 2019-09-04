import * as express from "express"
import {getWeekData, getOverviewData, getRandomEntries} from "./get-week-data"
import {LISTEN_PORT, DIARY_DIR} from "./config"
import {join} from "path"
import {readFileSync, readdirSync} from "fs"

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

app.get("/layers", async (req, res) => {
  const files = readdirSync(join(DIARY_DIR, "layers"))
  const layers = files.map(file => file.replace(/\.json$/, ""))
  res.send(layers)
})

app.get("/layers/:layerName", async (req, res) => {
  try {
    const layerName = req.params.layerName
    const file = join(DIARY_DIR, "layers", `${layerName}.json`)
    const data = JSON.parse(readFileSync(file, "utf8"))
    res.send(data)
  } catch (e) {
    if (e.code === "ENOENT") {
      res.sendStatus(404)
    } else {
      throw e
    }
  }
})

app.get("/random", async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 20
  const entries = getRandomEntries(limit)
  res.send(entries)
})

app.listen(LISTEN_PORT, "localhost", () => {
  console.log(`Listening on port ${LISTEN_PORT}`)
})
