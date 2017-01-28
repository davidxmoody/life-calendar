const path = require("path")
const express = require("express")
const nunjucks = require("nunjucks")
const moment = require("moment")

const SCANNED_DIR = "/home/david/sync/diary-data/scanned"

const generateWeeks = require("./generate-weeks")
const {birthDate, deathDate, eras} = require("../life-data.json")
const getDataForWeek = require("./get-data-for-week")

const currentDate = moment().format("YYYY-MM-DD")

const calendar = generateWeeks({currentDate, birthDate, deathDate, eras})

const app = express()

nunjucks.configure(path.join(__dirname, "./views"), {autoescape: true, express: app})

app.get("/", (req, res) => {
  res.render("index.njk", {calendar})
})

app.get("/weeks/:week", (req, res) => {
  const weekStart = req.params.week
  const data = getDataForWeek(weekStart)
  res.render("week.njk", {weekStart, data})
})

app.get("/eras", (req, res) => {
  res.render("eras.njk", {eras})
})

app.use("/scanned", express.static(SCANNED_DIR))

app.listen("5000", () => {
  console.log("App listening on http://localhost:5000/")
})
