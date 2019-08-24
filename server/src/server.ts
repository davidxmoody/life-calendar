import * as express from "express"
import {getWeekData, getOverviewData} from "./get-week-data"
import {LISTEN_PORT, DIARY_DIR} from "./config"
import {join} from "path"
import {readFileSync} from "fs"

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

app.listen(LISTEN_PORT, "localhost", () => {
  console.log(`Listening on port ${LISTEN_PORT}`)
})
