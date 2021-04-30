import {Entry} from "../../types"
import React from "react"
import Markdown from "./Markdown"
import {prettyFormatDateTime} from "../../helpers/dates"
import AudioPlayer from "./AudioPlayer"
import {REMOTE_URL} from "../../config"
import {Box, Button, useDisclosure} from "@chakra-ui/react"

interface Props {
  entry: Entry
}

export default function EntryComponent(props: Props) {
  const {isOpen, onToggle} = useDisclosure({defaultIsOpen: false})

  return (
    <Box>
      <Box
        border={["none", "1px solid lightgrey"]}
        p={[0, 4]}
        position="sticky"
        top="72px"
        bg="blue.900"
      >
        <Button mb={4} mx={4} mt={4} onClick={onToggle}>
          {prettyFormatDateTime(props.entry)}
        </Button>
      </Box>
      <Box
        border={["none", "1px solid lightgrey"]}
        p={[0, 4]}
        pt={[4, 6]}
        display="flex"
        flexDirection="column"
      >
        <Box>
          {props.entry.type === "markdown" ? (
            <Box mx={4}>
              <Markdown
                source={
                  isOpen
                    ? props.entry.content
                    : getSummaryMarkdown(props.entry.content)
                }
              />
            </Box>
          ) : null}

          {props.entry.type === "scanned" ? (
            <Box>
              <Markdown source={`![](${REMOTE_URL + props.entry.fileUrl})`} />
            </Box>
          ) : null}

          {props.entry.type === "audio" ? (
            <Box mx={4}>
              <AudioPlayer sourceUrl={props.entry.fileUrl} />
            </Box>
          ) : null}
        </Box>
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
