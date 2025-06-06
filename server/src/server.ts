import * as cors from "cors"
import * as express from "express"
import {readFileSync} from "fs"
import * as https from "https"
import {getEntries} from "./db/entries"
import {getLayers} from "./db/layers"
import {getLifeData} from "./db/lifeData"

if (
  !process.env.LOCAL_SSL_KEY ||
  !process.env.LOCAL_SSL_CERT ||
  !process.env.DIARY_DIR
) {
  throw new Error("Missing required environmental config")
}

const LISTEN_PORT = 8051

const SSL_KEY = readFileSync(process.env.LOCAL_SSL_KEY, "utf-8")
const SSL_CERT = readFileSync(process.env.LOCAL_SSL_CERT, "utf-8")

const VALID_TOKENS: Record<string, string> = JSON.parse(
  readFileSync(__dirname + "/../.tokens.json", "utf-8"),
)

process.chdir(process.env.DIARY_DIR)

const app = express()

app.use(
  cors({
    origin: [
      "https://localhost:3000",
      "https://davidxmoody-life-calendar.netlify.app",
    ],
  }),
)

app.use((req, res, next) => {
  const token = req.header("token") || req.query.token
  if (typeof token !== "string" || !token) {
    console.log("Request missing auth token")
    res.sendStatus(401)
  } else if (!VALID_TOKENS[token]) {
    console.log(`Invalid token: "${token}"`)
    res.sendStatus(403)
  } else {
    next()
  }
})

app.use("/images", express.static("images"))
app.use("/scanned", express.static("scanned"))
app.use("/audio", express.static("audio"))

app.get("/ping", async (_req, res) => {
  res.sendStatus(200)
})

app.get("/sync", async (req, res) => {
  const sinceMsFromQs = parseInt(req.query.sinceMs as string, 10)
  const sinceMs = isNaN(sinceMsFromQs) ? null : sinceMsFromQs

  const timestamp = new Date().getTime()

  const layers = await getLayers(sinceMs)
  const entries = await getEntries(sinceMs)
  const lifeData = await getLifeData(sinceMs)

  res.send({timestamp, layers, entries, lifeData})
})

https.createServer({key: SSL_KEY, cert: SSL_CERT}, app).listen(LISTEN_PORT)
