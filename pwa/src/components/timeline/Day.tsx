import {Box, Heading} from "@chakra-ui/react"
import {Atom, useAtomValue} from "jotai"
import {memo, startTransition, useRef, useState} from "react"
import {createDataForDayAtom, nullAtom} from "../../atoms"
import {prettyFormatDateTime} from "../../helpers/dates"
import {Entry, MarkdownEntry} from "../../types"
import HighlightedText from "./HighlightedText"
import AudioPlayer from "./AudioPlayer"
import Markdown from "./Markdown"
import ScannedPage from "./ScannedPage"
import {NAV_BAR_HEIGHT_PX} from "../nav/NavBar"

const borderColor = "gray.600"
const borderRadius = "md"
const borderWidth = "thin"
const headerColor = "blue.900"
const headerColorSelected = "blue.700"

interface Props {
  date: string
  headings: string[] | null
  selected: boolean
}

export default memo(function Day(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [dataAtom, setDataAtom] =
    useState<Atom<Promise<{entries: Entry[]}> | null>>(nullAtom)
  const data = useAtomValue(dataAtom)

  if (!props.headings?.length) {
    return (
      <Box maxW="800px" px={{base: 0, md: 2}} pb={{base: 4, md: 2}}>
        <EmptyDayHeader date={props.date} selected={props.selected} />
      </Box>
    )
  }

  function onToggle() {
    startTransition(() => {
      if (dataAtom === nullAtom) {
        setDataAtom(createDataForDayAtom(props.date))
      } else {
        setDataAtom(nullAtom)
      }

      const isHeaderSticky =
        headerRef.current?.getBoundingClientRect().top === NAV_BAR_HEIGHT_PX

      if (isHeaderSticky) {
        containerRef.current?.scrollIntoView()
      }
    })
  }

  return (
    <Box
      maxW="800px"
      px={{base: 0, md: 2}}
      pb={{base: 4, md: 2}}
      ref={containerRef}
    >
      <Box
        style={{contain: "paint"}}
        borderRadius={{base: 0, md: borderRadius}}
        position="relative"
      >
        <DayHeader
          headerRef={headerRef}
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
          onClick={data ? undefined : onToggle}
          cursor={data ? undefined : "pointer"}
          overflow="hidden"
        >
          {data ? (
            <Full entries={data.entries} />
          ) : (
            <Summary headings={props.headings} />
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
    </Box>
  )
})

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
  headerRef: React.Ref<HTMLDivElement>
}) {
  return (
    <Box
      ref={props.headerRef}
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
      {props.headings.map((heading, index) => (
        <HighlightedText key={index} as="div">
          {heading}
        </HighlightedText>
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
              <Box float="right" fontSize="xs" opacity={0.3}>
                {entry.time}
              </Box>
              <Markdown source={getMarkdownContent(entry)} />
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

function getMarkdownContent(entry: MarkdownEntry) {
  return entry.content.startsWith("#")
    ? entry.content
    : "### " + entry.time + "\n\n" + entry.content
}
