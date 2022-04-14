import * as express from "express"
import {getLayers} from "./db/layers"
import {getEntries} from "./db/entries"
import {readFileSync} from "fs"
import * as https from "https"

if (
  !process.env.LOCAL_SSL_KEY ||
  !process.env.LOCAL_SSL_CERT ||
  !process.env.DIARY_DIR
) {
  throw new Error("Missing required environmental config")
}

const LISTEN_PORT = 8051

const SSL_KEY = readFileSync(process.env.LOCAL_SSL_KEY)
const SSL_CERT = readFileSync(process.env.LOCAL_SSL_CERT)

process.chdir(process.env.DIARY_DIR)

const app = express()

app.use((req, res, next) => {
  console.log(req.path)
  res.header("Access-Control-Allow-Origin", "*")
  next()
})

app.use("/scanned", express.static("scanned"))
app.use("/thumbnails", express.static("thumbnails"))
app.use("/audio", express.static("audio"))

app.get("/sync", async (req, res) => {
  const sinceMsFromQs = parseInt(req.query.sinceMs as string, 10)
  const sinceMs = isNaN(sinceMsFromQs) ? null : sinceMsFromQs

  const timestamp = new Date().getTime()

  const layers = await getLayers(sinceMs)
  const entries = await getEntries(sinceMs)

  res.send({timestamp, layers, entries})
})

https.createServer({key: SSL_KEY, cert: SSL_CERT}, app).listen(LISTEN_PORT)
