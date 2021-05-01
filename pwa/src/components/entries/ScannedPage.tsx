import {AspectRatio, Box, Image} from "@chakra-ui/react"
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
    <AspectRatio
      ratio={props.entry.width / props.entry.height}
      w={props.isExpanded ? "100%" : "40px"}
      bg={props.entry.averageColor}
      mb={4}
    >
      <Box>
        {props.isExpanded ? (
          <Image
            src={src}
            width="100%"
            height="100%"
            fallback={<Box>Error loading</Box>}
          />
        ) : null}
      </Box>
    </AspectRatio>
  )
}
