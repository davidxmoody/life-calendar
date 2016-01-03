import generateWeeks from './generateWeeks'
import birthDate from '../data/birthDate'
import fs from 'fs'
import path from 'path'

const baseDir = './weeks'

fs.mkdirSync(baseDir)

const weeks = generateWeeks({birthDate})

for (const week of weeks) {
  const filePath = path.join(baseDir, `${week.startDate}.md`)
  fs.writeFileSync(filePath, '')
}
