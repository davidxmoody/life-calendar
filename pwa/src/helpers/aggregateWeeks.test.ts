import aggregateWeeks from "./aggregateWeeks"

// Week starts (Mondays):
// 2022-11-07 week: 2022-11-07 .. 2022-11-13
// 2022-10-31 week: 2022-10-31 .. 2022-11-06

test("returns an empty object when there is no data", () => {
  expect(aggregateWeeks({})).toEqual({})
})

test("keys values by the Monday of their week", () => {
  const result = aggregateWeeks({
    "2022-10-31": 100,
    "2022-11-07": 400,
  })

  expect(result).toEqual({
    "2022-10-31": 100,
    "2022-11-07": 400,
  })
})

test("sums values from multiple days in the same week", () => {
  const result = aggregateWeeks({
    "2022-10-31": 50,
    "2022-11-01": 50,
    "2022-11-06": 25, // still the 10-31 week (Sunday)
    "2022-11-07": 200,
  })

  expect(result).toEqual({
    "2022-10-31": 125,
    "2022-11-07": 200,
  })
})

test("keeps zero values", () => {
  expect(aggregateWeeks({"2022-11-07": 0})).toEqual({"2022-11-07": 0})
})
