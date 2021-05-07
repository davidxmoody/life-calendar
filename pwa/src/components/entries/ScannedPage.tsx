import {AspectRatio, Box, Flex, Image} from "@chakra-ui/react"
import * as React from "react"
import {REMOTE_URL} from "../../config"
import {ScannedEntry} from "../../types"

interface Props {
  entry: ScannedEntry
  isExpanded: boolean
}

export default function ScannedPage(props: Props) {
  const src = REMOTE_URL + props.entry.fileUrl

  return (
    <Flex mb={4} alignItems="center" px={props.isExpanded ? 0 : 3}>
      <AspectRatio
        ratio={props.entry.width / props.entry.height}
        w={props.isExpanded ? "100%" : "40px"}
        bg={props.entry.averageColor}
        flexShrink={0}
      >
        <Box>
          {props.isExpanded ? (
            <Image src={src} width="100%" height="100%" />
          ) : null}
        </Box>
      </AspectRatio>
      {!props.isExpanded && props.entry.headings ? (
        <Box ml={3}>
          {props.entry.headings.length === 0 ? (
            <Box>...</Box>
          ) : (
            props.entry.headings.map((heading, i) => (
              <Box key={i}>{heading}</Box>
            ))
          )}
        </Box>
      ) : null}
    </Flex>
  )
}
