const path = require("path")
const express = require("express")
const nunjucks = require("nunjucks")
const moment = require("moment")

const generateWeeks = require("./generate-weeks")
const {birthDate, deathDate, eras} = require("../life-data.json")

const currentDate = moment().format("YYYY-MM-DD")

// Hack
for (const era of eras) {
  if (era.startDate === "today") era.startDate = currentDate
  if (era.endDate === "today") era.endDate = currentDate
}

const weeks = generateWeeks({currentDate, birthDate, deathDate, eras})

const app = express()

nunjucks.configure(path.join(__dirname, "./views"), {autoescape: true, express: app})

app.get("/", (req, res) => {
  res.render("index.njk", {currentDate, weeks, eras})
})

app.listen("5000", () => {
  console.log("App listening on http://localhost:5000/")
})
