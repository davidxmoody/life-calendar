const fs = require("fs")
const marked = require("marked")
const {join} = require("path")

// Hard-coded path, for testing
const WEEKS_DIR = "/home/david/sync/diary-data/weeks"

function unsafeGetHtmlContents(weekStart) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStart))
    throw new Error("Start date must follow the YYYY-MM-DD format")

  const weekFile = join(WEEKS_DIR, `${weekStart}.md`)
  return marked(fs.readFileSync(weekFile).toString())
}

module.exports = (weekStart) => {
  try {
    const contents = unsafeGetHtmlContents(weekStart)

    return {
      contents,
    }
  } catch (e) {
    return {
      contents: "<p>Could not get data</p>",
    }
  }
}
