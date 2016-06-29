const path = require("path")
const express = require("express")
const nunjucks = require("nunjucks")
const moment = require("moment")

const generateWeeks = require('./src/generateWeeks')
const birthDate = require('./data/birthDate')
const eras = require('./data/eras')

const currentDate = moment().format('YYYY-MM-DD')
const weeks = generateWeeks({currentDate, birthDate, eras})

const app = express()

app.set("views", path.join(__dirname, "./views"))

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.get("/", (req, res) => {
  res.render("index.njk", {weeks})
})

app.get("/weeks/:week", (req, res) => {
  res.send(req.params.week + " it worked!")
})

app.listen("5000", () => {
  console.log("App listening on port http://localhost:5000/")
})
