import {Box, Heading, useColorModeValue, useDisclosure} from "@chakra-ui/react"
import {Atom, useAtom} from "jotai"
import * as React from "react"
import {memo, startTransition, useState} from "react"
import {getEntriesForDayAtom, nullAtom} from "../../atoms"
import {prettyFormatDateTime} from "../../helpers/dates"
import {Entry} from "../../types"
import AudioPlayer from "./AudioPlayer"
import Markdown from "./Markdown"
import ScannedPage from "./ScannedPage"

interface Props {
  date: string
  headings: null | Array<{
    headings: string[]
    type: "markdown" | "scanned" | "audio"
  }>
}

export default memo(function Day(props: Props) {
  const {isOpen, onToggle} = useDisclosure({defaultIsOpen: false})
  const [entriesAtom, setEntriesAtom] =
    useState<Atom<Promise<Entry[]> | null>>(nullAtom)
  const [entries] = useAtom(entriesAtom)

  function onClick() {
    startTransition(() => {
      if (entriesAtom === nullAtom) {
        setEntriesAtom(getEntriesForDayAtom(props.date))
      }
      onToggle()
    })
  }

  return (
    <Box maxW="800px" mb={4}>
      <DayHeader date={props.date} onClick={onClick} />

      <Box
        borderLeftWidth={[0, "thin"]}
        borderRightWidth={[0, "thin"]}
        borderBottomWidth={[0, "thin"]}
        borderBottomRadius={[0, "md"]}
        borderColor="gray.600"
        overflow="hidden"
      >
        {isOpen && entries ? (
          <Full entries={entries} />
        ) : props.headings ? (
          <Summary headings={props.headings} onClick={onClick} />
        ) : null}
      </Box>
    </Box>
  )
})

function DayHeader(props: {date: string; onClick: () => void}) {
  const bodyBackground = useColorModeValue("white", "gray.800")

  return (
    <Box bg={bodyBackground} position="sticky" top={0} zIndex="sticky">
      <Box
        p={4}
        borderTopRadius={[0, "md"]}
        borderWidth={[0, "thin"]}
        borderColor="gray.600"
        bg="blue.900"
        onClick={props.onClick}
        cursor="pointer"
      >
        <Heading size="md" color="white">
          {prettyFormatDateTime({date: props.date})}
        </Heading>
      </Box>
    </Box>
  )
}

function Summary(props: {
  headings: NonNullable<Props["headings"]>
  onClick: () => void
}) {
  return (
    <Box px={4} py={2}>
      {props.headings.map((heading, i) => (
        <Box key={i} display="flex">
          {heading.type === "markdown"
            ? "⌨️"
            : heading.type === "scanned"
            ? "📝"
            : "🎤"}{" "}
          <Box ml={2}>
            {heading.headings.map((h, j) => (
              <Box
                key={j}
                onClick={props.onClick}
                cursor="pointer"
                _hover={{background: "grey"}}
              >
                {h}
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

function Full(props: {entries: Entry[]}) {
  return (
    <Box>
      {props.entries.map((entry, i) => (
        <Box key={entry.id} mb={i === props.entries.length - 1 ? 0 : 2}>
          {entry.type === "markdown" ? (
            <Box mx={[4, 8]} my={[4, 6]}>
              <Markdown
                source={
                  entry.content.startsWith("#")
                    ? entry.content
                    : "### " + entry.time + "\n\n" + entry.content
                }
              />
            </Box>
          ) : entry.type === "scanned" ? (
            <ScannedPage entry={entry} />
          ) : entry.type === "audio" ? (
            <Box mx={[4, 8]} my={[4, 6]}>
              <AudioPlayer sourceUrl={entry.fileUrl} />
            </Box>
          ) : null}
        </Box>
      ))}
    </Box>
  )
}
