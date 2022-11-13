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

const borderColor = "gray.600"
const borderRadius = "md"
const borderWidth = "thin"
const headerColor = "blue.900"
const headerColorSelected = "blue.700"

interface Props {
  date: string
  headings: string[] | null
  searchRegex: string
  selected: boolean
}

function useEntriesData(date: string) {
  const [entriesAtom, setEntriesAtom] =
    useState<Atom<Promise<Entry[]> | null>>(nullAtom)
  const [entries] = useAtom(entriesAtom)

  function onToggle() {
    startTransition(() => {
      if (entriesAtom === nullAtom) {
        setEntriesAtom(createEntriesForDayAtom(date))
      } else {
        setEntriesAtom(nullAtom)
      }
    })
  }

  return {entries, onToggle}
}

export default memo(function Day(props: Props) {
  const {entries, onToggle} = useEntriesData(props.date)

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
      <Box
        style={{contain: "paint"}}
        borderRadius={{base: 0, md: borderRadius}}
        position="relative"
      >
        <DayHeader
          date={props.date}
          selected={props.selected}
          onClick={onToggle}
        />

        <Box
          borderLeftWidth={{base: 0, md: borderWidth}}
          borderRightWidth={{base: 0, md: borderWidth}}
          borderBottomWidth={{base: 0, md: borderWidth}}
          borderBottomRadius={{base: 0, md: borderRadius}}
          borderColor={borderColor}
          onClick={entries ? undefined : onToggle}
          cursor={entries ? undefined : "pointer"}
          overflow="hidden"
        >
          {entries ? (
            <Full entries={entries} />
          ) : (
            <Summary
              headings={props.headings}
              searchRegex={props.searchRegex}
            />
          )}
        </Box>

        <Box
          position="absolute"
          pointerEvents="none"
          bottom={0}
          left={0}
          right={0}
          zIndex="sticky"
          height="20px"
          borderLeftWidth={{base: 0, md: borderWidth}}
          borderRightWidth={{base: 0, md: borderWidth}}
          borderBottomWidth={{base: 0, md: borderWidth}}
          borderBottomRadius={{base: 0, md: borderRadius}}
          borderColor={borderColor}
        />
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
        borderRadius={{base: 0, md: borderRadius}}
        borderWidth={{base: 0, md: borderWidth}}
        borderColor={borderColor}
        bg={props.selected ? headerColorSelected : headerColor}
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
  selected: boolean
  onClick: () => void
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
        borderTopRadius={{base: 0, md: borderRadius}}
        borderWidth={{base: 0, md: borderWidth}}
        borderColor={borderColor}
        bg={props.selected ? headerColorSelected : headerColor}
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
