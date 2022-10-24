import {Box, Heading, useColorModeValue} from "@chakra-ui/react"
import {Atom, useAtom} from "jotai"
import * as React from "react"
import {memo, startTransition, useState} from "react"
import {createEntriesForDayAtom, nullAtom} from "../../atoms"
import {prettyFormatDateTime} from "../../helpers/dates"
import {Entry, EntryContentType} from "../../types"
import AudioPlayer from "./AudioPlayer"
import Markdown from "./Markdown"
import ScannedPage from "./ScannedPage"

interface Props {
  date: string
  headings: null | Array<{
    type: EntryContentType
    headings: string[]
  }>
}

export default memo(function Day(props: Props) {
  const [entriesAtom, setEntriesAtom] =
    useState<Atom<Promise<Entry[]> | null>>(nullAtom)
  const [entries] = useAtom(entriesAtom)

  function onClick() {
    startTransition(() => {
      if (entriesAtom === nullAtom) {
        setEntriesAtom(createEntriesForDayAtom(props.date))
      } else {
        setEntriesAtom(nullAtom)
      }
    })
  }

  if (!props.headings?.length) {
    return (
      <Container>
        <EmptyDayHeader date={props.date} />
      </Container>
    )
  }

  return (
    <Container>
      <DayHeader date={props.date} onClick={onClick} />

      <Box
        borderLeftWidth={[0, "thin"]}
        borderRightWidth={[0, "thin"]}
        borderBottomWidth={[0, "thin"]}
        borderBottomRadius={[0, "md"]}
        borderColor="gray.600"
        overflow="hidden"
        onClick={entries ? undefined : onClick}
        cursor={entries ? undefined : "pointer"}
      >
        {entries ? (
          <Full entries={entries} />
        ) : (
          <Summary headings={props.headings} />
        )}
      </Box>
    </Container>
  )
})

function Container(props: {children: React.ReactNode}) {
  return (
    <Box maxW="800px" mb={4}>
      {props.children}
    </Box>
  )
}

function EmptyDayHeader(props: {date: string}) {
  const bodyBackground = useColorModeValue("white", "gray.800")

  return (
    <Box bg={bodyBackground} opacity={0.5}>
      <Box
        p={4}
        borderRadius={[0, "md"]}
        borderWidth={[0, "thin"]}
        borderColor="gray.600"
        bg="blue.900"
      >
        <Heading size="md" color="white">
          {prettyFormatDateTime({date: props.date})}
        </Heading>
      </Box>
    </Box>
  )
}

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

function Summary(props: {headings: NonNullable<Props["headings"]>}) {
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
              <Box key={j}>{h}</Box>
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