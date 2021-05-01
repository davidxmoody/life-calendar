import {Box, Button, useDisclosure} from "@chakra-ui/react"
import * as React from "react"
import {prettyFormatDateTime} from "../../helpers/dates"
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
    <Box>
      <Box
        border={["none", "1px solid lightgrey"]}
        p={[0, 4]}
        position="sticky"
        top="72px"
        bg="blue.900"
        zIndex="sticky"
      >
        <Button mb={4} mx={4} mt={4} onClick={onToggle}>
          {prettyFormatDateTime({date: props.date})}
        </Button>
      </Box>
      <Box
        border={["none", "1px solid lightgrey"]}
        p={[0, 4]}
        pt={[4, 6]}
        display="flex"
        flexDirection="column"
      >
        {props.entries.map((entry) => (
          <React.Fragment key={entry.id}>
            <Box>
              {entry.type === "markdown" ? (
                <Box mx={4}>
                  <Markdown
                    source={
                      isOpen
                        ? entry.content.startsWith("#")
                          ? entry.content
                          : "### " + entry.time + "\n\n" + entry.content
                        : getSummaryMarkdown(entry.content)
                    }
                  />
                </Box>
              ) : null}

              {entry.type === "scanned" ? (
                <ScannedPage entry={entry} isExpanded={isOpen} />
              ) : null}

              {entry.type === "audio" ? (
                <Box mx={4}>
                  <AudioPlayer sourceUrl={entry.fileUrl} />
                </Box>
              ) : null}
            </Box>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  )
}

function getSummaryMarkdown(markdown: string) {
  return markdown
    .split("\n")
    .map((line) => {
      if (line.startsWith("#")) {
        return "\n" + line.replace(/#*/, "####") + "\n\n"
      }
      if (line === "") {
        return " "
      }
      return line.replace(/[\S]+[\s]?/g, ".").replace(/\.\.\./g, ".")
    })
    .join("")
}
