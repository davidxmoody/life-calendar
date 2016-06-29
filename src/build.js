const generateWeeks = require('./generateWeeks')
const birthDate = require('../data/birthDate')
const fs = require('fs')
const path = require('path')

const baseDir = './weeks'

fs.mkdirSync(baseDir)

const weeks = generateWeeks({birthDate})

for (const week of weeks) {
  const filePath = path.join(baseDir, `${week.startDate}.md`)
  fs.writeFileSync(filePath, '')
}
