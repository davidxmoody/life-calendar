export default function formatTsv<T extends {}>(
  columns: Array<keyof T>,
  data: T[]
): string {
  return [columns, ...data.map((d) => columns.map((c) => d[c]))]
    .map((row) => row.join("	") + "\n")
    .join("")
}
