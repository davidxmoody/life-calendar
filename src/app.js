const path = require("path")
const express = require("express")
const nunjucks = require("nunjucks")
const moment = require("moment")

const generateWeeks = require("./generate-weeks")
const {birthDate, deathDate, eras} = require("../life-data.json")

const calendar = generateWeeks({birthDate, deathDate, eras})

const app = express()

nunjucks.configure(path.join(__dirname, "./views"), {autoescape: true, express: app})

app.get("/", (req, res) => {
  const currentDate = moment().format("YYYY-MM-DD")

  res.render("index.njk", {currentDate, calendar, eras})
})

app.listen("5000", () => {
  console.log("App listening on http://localhost:5000/")
})
