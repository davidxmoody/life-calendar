const path = require("path")
const express = require("express")
const nunjucks = require("nunjucks")
const moment = require("moment")

const generateWeeks = require("./generateWeeks")
const birthDate = require("../data/birthDate")
const eras = require("../data/eras")

const currentDate = moment().format("YYYY-MM-DD")
const weeks = generateWeeks({currentDate, birthDate, eras})

const app = express()

nunjucks.configure(path.join(__dirname, "./views"), {autoescape: true, express: app})

app.get("/", (req, res) => {
  res.render("index.njk", {weeks})
})

app.listen("5000", () => {
  console.log("App listening on port http://localhost:5000/")
})
