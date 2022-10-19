import {Box, Heading, useColorModeValue, useDisclosure} from "@chakra-ui/react"
import * as React from "react"
import {prettyFormatDateTime} from "../../helpers/dates"
import getHeadings from "../../helpers/getHeadings"
import {Entry} from "../../types"
import AudioPlayer from "./AudioPlayer"
import Markdown from "./Markdown"
import ScannedPage from "./ScannedPage"

interface Props {
  date: string
  entries: Entry[]
}

export default function Day(props: Props) {
  const {isOpen, onToggle} = useDisclosure({defaultIsOpen: false})

  return (
    <Box maxW="800px">
      <DayHeader date={props.date} entries={props.entries} onClick={onToggle} />

      <Box
        borderLeftWidth={[0, "thin"]}
        borderRightWidth={[0, "thin"]}
        borderBottomWidth={[0, "thin"]}
        borderBottomRadius={[0, "md"]}
        borderColor="gray.600"
        overflow="hidden"
      >
        {isOpen ? (
          <Full entries={props.entries} />
        ) : (
          <Summary entries={props.entries} onClick={onToggle} />
        )}
      </Box>
    </Box>
  )
}

function DayHeader(props: {
  date: string
  entries: Entry[]
  onClick: () => void
}) {
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

function Summary(props: {entries: Entry[]; onClick: () => void}) {
  const headings = getHeadings(props.entries)

  return (
    <Box px={4} py={2} onClick={props.onClick} cursor="pointer">
      {headings.map((heading, i) => (
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
