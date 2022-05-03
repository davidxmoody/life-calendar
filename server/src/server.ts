import * as express from "express"
import {getLayers} from "./db/layers"
import {getEntries} from "./db/entries"
import {readFileSync} from "fs"
import * as https from "https"
import * as cookieParser from "cookie-parser"
import {v4} from "uuid"
import * as cors from "cors"

if (
  !process.env.LOCAL_SSL_KEY ||
  !process.env.LOCAL_SSL_CERT ||
  !process.env.DIARY_DIR
) {
  throw new Error("Missing required environmental config")
}

const LISTEN_PORT = 8051
const COOKIE_TOKEN_NAME = "lc_token"

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
    credentials: true,
  }),
)

app.use(cookieParser())

app.use((req, res, next) => {
  console.log(req.path)

  if (!req.cookies[COOKIE_TOKEN_NAME]) {
    const token = v4()
    res.cookie(COOKIE_TOKEN_NAME, token, {secure: true, httpOnly: true})
    res.sendStatus(401)
    console.log(`New device registered with token: "${token}"`)
  } else if (!VALID_TOKENS[req.cookies[COOKIE_TOKEN_NAME]]) {
    res.sendStatus(403)
    console.log(`Invalid token: "${req.cookies[COOKIE_TOKEN_NAME]}"`)
  } else {
    next()
  }
})

app.use("/scanned", express.static("scanned"))
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
