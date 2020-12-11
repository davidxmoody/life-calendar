import * as express from "express"
import {getLayers} from "./db/layers"
import {getEntries} from "./db/entries"

const LISTEN_PORT = 3001
const DIARY_DIR = process.env.DIARY_DIR

if (!DIARY_DIR) {
  throw new Error("DIARY_DIR env var is not set")
}

process.chdir(DIARY_DIR)

const app = express()

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  next()
})

app.use("/scanned", express.static("scanned"))
app.use("/audio", express.static("audio"))

app.get("/sync", async (req, res) => {
  const sinceMsFromQs = parseInt(req.query.sinceMs as string, 10)
  const sinceMs = isNaN(sinceMsFromQs) ? null : sinceMsFromQs

  const layers = await getLayers(sinceMs)
  const entries = await getEntries(sinceMs)

  res.send({layers, entries})
})

app.listen(LISTEN_PORT, "localhost", () => {
  console.log(`Listening on port ${LISTEN_PORT}`)
})
