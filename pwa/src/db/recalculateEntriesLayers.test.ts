import {vi} from "vitest"
import recalculateEntriesLayers, {
  wordcountToScore,
} from "./recalculateEntriesLayers"

test("makes no changes when no entries have changed", async () => {
  const saveLayer = vi.fn()

  await recalculateEntriesLayers({
    changedWeeks: [],
    getEntriesForWeek: () => Promise.resolve([]),
    getLayer: () => Promise.resolve(undefined),
    saveLayer,
  })

  expect(saveLayer).not.toBeCalled()
})

test("creates a new markdown layer when one new entry is added", async () => {
  const saveLayer = vi.fn()

  await recalculateEntriesLayers({
    changedWeeks: ["2022-09-19"],
    getEntriesForWeek: () =>
      Promise.resolve([
        {
          date: "2022-09-20",
          content: "Hello world",
        },
      ]),
    getLayer: () => Promise.resolve(undefined),
    saveLayer,
  })

  expect(saveLayer).toHaveBeenCalledWith({
    id: "diary/markdown",
    data: {"2022-09-19": wordcountToScore(2)},
  })
})

test("updates an existing markdown layer when one entry is modified", async () => {
  const saveLayer = vi.fn()

  await recalculateEntriesLayers({
    changedWeeks: ["2022-09-19"],
    getEntriesForWeek: (weekStart: string) => {
      if (weekStart === "2022-09-19") {
        return Promise.resolve([
          {
            date: "2022-09-20",
            content: "Hello world",
          },
        ])
      } else {
        throw new Error("Wrong week start called")
      }
    },
    getLayer: () =>
      Promise.resolve({
        id: "diary/markdown",
        data: {
          "2022-09-12": wordcountToScore(40),
          "2022-09-19": wordcountToScore(99),
        },
      }),
    saveLayer,
  })

  expect(saveLayer).toHaveBeenCalledWith({
    id: "diary/markdown",
    data: {
      "2022-09-12": wordcountToScore(40),
      "2022-09-19": wordcountToScore(2),
    },
  })
})

test("combines wordcount from multiple entries in same week", async () => {
  const saveLayer = vi.fn()

  await recalculateEntriesLayers({
    changedWeeks: ["2022-09-19"],
    getEntriesForWeek: (weekStart: string) => {
      if (weekStart === "2022-09-19") {
        return Promise.resolve([
          {
            date: "2022-09-20",
            content: "Hello world foo bar",
          },
          {
            date: "2022-09-21",
            content: "Another entry here",
          },
        ])
      } else {
        throw new Error("Wrong week start called")
      }
    },
    getLayer: () => Promise.resolve(undefined),
    saveLayer,
  })

  expect(saveLayer).toHaveBeenCalledWith({
    id: "diary/markdown",
    data: {"2022-09-19": wordcountToScore(7)},
  })
})
