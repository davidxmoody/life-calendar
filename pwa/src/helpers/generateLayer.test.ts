import generateLayer from "./generateLayer"

test("generates an empty layer", () => {
  const layer = generateLayer({dates: []})
  expect(layer).toEqual({})
})

test("groups dates by week start", () => {
  const layer = generateLayer({
    dates: ["2022-11-05", "2022-11-06", "2022-11-07"],
  })
  expect(layer).toEqual({"2022-10-31": 2, "2022-11-07": 1})
})

test("applies a scoring function", () => {
  const layer = generateLayer({
    dates: ["2022-10-31"],
    scoringFn: (x) => x / 10,
  })
  expect(layer).toEqual({"2022-10-31": 0.1})
})

test("merges onto an existing layer", () => {
  const existingLayer = {"2022-10-24": 0.5, "2022-10-31": 0.5}
  const layer = generateLayer({dates: ["2022-10-31"], existingLayer})
  expect(layer).toEqual({"2022-10-24": 0.5, "2022-10-31": 1})
})
