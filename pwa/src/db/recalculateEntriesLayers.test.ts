import {repeat} from "ramda"
import recalculateEntriesLayers, {
  audioWordcountRatio,
  scannedWordcountRatio,
  wordcountToScore,
} from "./recalculateEntriesLayers"

test("makes no changes when no entries have changed", async () => {
  const saveLayer = jest.fn()

  await recalculateEntriesLayers({
    changedWeeks: [],
    getEntriesForWeek: () => Promise.resolve([]),
    getLayer: () => Promise.resolve(undefined),
    saveLayer,
  })

  expect(saveLayer).not.toBeCalled()
})

test("creates a new markdown layer when one new entry is added", async () => {
  const saveLayer = jest.fn()

  await recalculateEntriesLayers({
    changedWeeks: ["2022-09-19"],
    getEntriesForWeek: () =>
      Promise.resolve([
        {
          id: "2022-09-20-markdown-13:00",
          type: "markdown",
          date: "2022-09-20",
          time: "13:00",
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
  const saveLayer = jest.fn()

  await recalculateEntriesLayers({
    changedWeeks: ["2022-09-19"],
    getEntriesForWeek: (weekStart: string) => {
      if (weekStart === "2022-09-19") {
        return Promise.resolve([
          {
            id: "2022-09-20-markdown-13:00",
            type: "markdown",
            date: "2022-09-20",
            time: "13:00",
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

test("updates layers for all content types", async () => {
  const numMarkdownWords = 800

  const saveLayer = jest.fn()

  await recalculateEntriesLayers({
    changedWeeks: ["2022-09-19"],
    getEntriesForWeek: (weekStart: string) => {
      if (weekStart === "2022-09-19") {
        return Promise.resolve([
          {
            id: "2022-09-20-markdown-13:00",
            type: "markdown",
            date: "2022-09-20",
            time: "13:00",
            content: repeat("foo", numMarkdownWords).join(" "),
          },
          {
            id: "2022-09-20-scanned-01",
            type: "scanned",
            date: "2022-09-20",
            sequenceNumber: 1,
            fileUrl: "foo",
            averageColor: "foo",
            width: 1,
            height: 1,
          },
          {
            id: "2022-09-20-audio-13:00",
            type: "audio",
            date: "2022-09-20",
            time: "13:00",
            fileUrl: "foo",
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
    data: {"2022-09-19": wordcountToScore(numMarkdownWords)},
  })
  expect(saveLayer).toHaveBeenCalledWith({
    id: "diary/scanned",
    data: {"2022-09-19": wordcountToScore(scannedWordcountRatio)},
  })
  expect(saveLayer).toHaveBeenCalledWith({
    id: "diary/audio",
    data: {"2022-09-19": wordcountToScore(audioWordcountRatio)},
  })
})
