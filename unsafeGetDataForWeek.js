const fs = require("fs")
const marked = require("marked")
const {join} = require("path")

// Hard-coded path, for testing
const WEEKS_DIR = "/home/david/sync/diary-data/weeks"

module.exports = startDate => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate))
    throw new Error("Start date must follow the YYYY-MM-DD format")

  const weekFile = join(WEEKS_DIR, `${startDate}.md`)
  const weekContents = fs.readFileSync(weekFile).toString()
  const weekHtml = marked(weekContents)
  return {contents: weekHtml}
}
