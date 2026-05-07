import mergeLayers from "./mergeLayers"

// Week starts (Mondays):
// 2022-11-07 week: 2022-11-07 .. 2022-11-13
// 2022-10-31 week: 2022-10-31 .. 2022-11-06

test("returns an empty object when no layers contribute", () => {
  expect(mergeLayers([])).toEqual({})
  expect(mergeLayers([{}])).toEqual({})
})

test("aggregates day values into per-week sums and normalizes to [0,1]", () => {
  const result = mergeLayers([
    {
      "2022-10-31": 100, // week A: 100
      "2022-11-07": 400, // week B: 400 (max)
    },
  ])

  expect(result).toEqual({
    "2022-10-31": Math.pow(100 / 400, 0.5),
    "2022-11-07": 1,
  })
})

test("sums values from multiple days in the same week before normalizing", () => {
  const result = mergeLayers([
    {
      "2022-10-31": 50,
      "2022-11-01": 50, // same week as 10-31, sum = 100
      "2022-11-07": 200, // max
    },
  ])

  expect(result).toEqual({
    "2022-10-31": Math.pow(100 / 200, 0.5),
    "2022-11-07": 1,
  })
})

test("merges multiple layers by summing normalized week values, clamped to 1", () => {
  const result = mergeLayers([
    {"2022-10-31": 10, "2022-11-07": 20},
    {"2022-10-31": 5, "2022-11-07": 5},
  ])

  // Layer 1: max=20 → {31: sqrt(0.5), 07: 1}
  // Layer 2: max=5  → {31: 1, 07: 1}
  // Combined: clamp(sqrt(0.5)+1)=1, clamp(1+1)=1
  expect(result).toEqual({
    "2022-10-31": 1,
    "2022-11-07": 1,
  })
})

test("ignores layers whose values are all zero", () => {
  const result = mergeLayers([
    {"2022-11-07": 0, "2022-10-31": 0},
    {"2022-11-07": 10},
  ])

  expect(result).toEqual({"2022-11-07": 1})
})
