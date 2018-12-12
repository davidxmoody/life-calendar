import * as knex from "knex"
import {getAllEntries} from "../get-week-data"
import {DIARY_DIR} from "../config"

async function run() {
  const db = knex({
    client: "sqlite3",
    connection: {
      filename: "/Users/davidmoody/tmp/diary.db",
    },
  })

  await db.schema.createTable("entries", table => {
    table.increments("id").primary()
    table.text("original_filename").notNullable()
    table.text("created_at").notNullable()
    table.text("content").notNullable()
  })

  for (const entry of getAllEntries()) {
    await db.insert({
      original_filename: entry.file.replace(DIARY_DIR + "/", ""),
      created_at: entry.date,
      content: entry.content,
    }).into("entries")

    console.log(`Inserted entry for: ${entry.date}`)
  }

  console.log("Database created successfully")
}

try {
  run()
} catch (e) {
  console.error("Error", e)
}
