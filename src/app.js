const path = require("path")
const express = require("express")
const nunjucks = require("nunjucks")
const moment = require("moment")

const generateWeeks = require("./generate-weeks")
const {birthDate, deathDate, eras} = require("../life-data.json")

const currentDate = moment().format("YYYY-MM-DD")

const calendar = generateWeeks({currentDate, birthDate, deathDate, eras})

const app = express()

nunjucks.configure(path.join(__dirname, "./views"), {autoescape: true, express: app})

app.get("/", (req, res) => {
  res.render("index.njk", {calendar, currentDate})
})

app.listen("5000", () => {
  console.log("App listening on http://localhost:5000/")
})
