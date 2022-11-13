import {Box, Heading} from "@chakra-ui/react"
import {Atom, useAtom} from "jotai"
import * as React from "react"
import {memo, startTransition, useState} from "react"
import {createEntriesForDayAtom, nullAtom} from "../../atoms"
import {prettyFormatDateTime} from "../../helpers/dates"
import {Entry} from "../../types"
import HighlightedText from "./HighlightedText"
import AudioPlayer from "./AudioPlayer"
import Markdown from "./Markdown"
import ScannedPage from "./ScannedPage"

interface Props {
  date: string
  headings: string[] | null
  searchRegex: string
  selected: boolean
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
    if (props.searchRegex) {
      return null
    }

    return (
      <Container>
        <EmptyDayHeader date={props.date} selected={props.selected} />
      </Container>
    )
  }

  return (
    <Container>
      <DayHeader
        date={props.date}
        headings={props.headings}
        onClick={onClick}
        selected={props.selected}
      />

      <Box
        borderLeftWidth={{base: 0, md: "thin"}}
        borderRightWidth={{base: 0, md: "thin"}}
        borderBottomWidth={{base: 0, md: "thin"}}
        borderBottomRadius={{base: 0, md: "md"}}
        borderColor="gray.600"
        overflow="hidden"
        onClick={entries ? undefined : onClick}
        cursor={entries ? undefined : "pointer"}
      >
        {entries ? (
          <Full entries={entries} />
        ) : (
          <Summary headings={props.headings} searchRegex={props.searchRegex} />
        )}
      </Box>
    </Container>
  )
})

function Container(props: {children: React.ReactNode}) {
  return (
    <Box maxW="800px" px={{base: 0, md: 2}} pb={{base: 4, md: 2}}>
      {props.children}
    </Box>
  )
}

function EmptyDayHeader(props: {date: string; selected: boolean}) {
  return (
    <Box bg="gray.800" opacity={0.5} pt={{base: 0, md: 2}}>
      <Box
        p={4}
        borderRadius={{base: 0, md: "md"}}
        borderWidth={{base: 0, md: "thin"}}
        borderColor="gray.600"
        bg={props.selected ? "blue.700" : "blue.900"}
        transition="background 0.3s"
      >
        <Heading size="md" color="white">
          {prettyFormatDateTime({date: props.date})}
        </Heading>
      </Box>
    </Box>
  )
}

function DayHeader(props: {
  date: string
  headings: NonNullable<Props["headings"]>
  onClick: () => void
  selected: boolean
}) {
  return (
    <Box
      bg="gray.800"
      position="sticky"
      top={0}
      zIndex="sticky"
      pt={{base: 0, md: 2}}
    >
      <Box
        p={4}
        borderTopRadius={{base: 0, md: "md"}}
        borderWidth={{base: 0, md: "thin"}}
        borderColor="gray.600"
        bg={props.selected ? "blue.700" : "blue.900"}
        transition="background 0.3s"
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
  searchRegex: string
}) {
  return (
    <Box px={4} py={2}>
      {props.headings.map((heading, index) => (
        <Box key={index}>
          <HighlightedText searchRegex={props.searchRegex}>
            {heading}
          </HighlightedText>
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
            <Box mx={{base: 4, md: 8}} my={{base: 4, md: 6}}>
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
            <Box mx={{base: 4, md: 8}} my={{base: 4, md: 6}}>
              <AudioPlayer sourceUrl={entry.fileUrl} />
            </Box>
          ) : null}
        </Box>
      ))}
    </Box>
  )
}
