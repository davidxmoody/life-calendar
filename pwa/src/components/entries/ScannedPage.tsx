import {AspectRatio, Box, Flex, Image} from "@chakra-ui/react"
import * as React from "react"
import {getScannedUrl, getThumbnailUrl} from "../../helpers/getImageUrls"
import {ScannedEntry} from "../../types"

interface Props {
  entry: ScannedEntry
  isExpanded: boolean
}

export default function ScannedPage(props: Props) {
  return (
    <Flex mb={4} alignItems="center" px={props.isExpanded ? 0 : 3}>
      <AspectRatio
        ratio={props.entry.width / props.entry.height}
        w={props.isExpanded ? "100%" : "60px"}
        bg={props.entry.averageColor}
        flexShrink={0}
      >
        <Box position="relative" width="100%" height="100%">
          <Image
            src={getThumbnailUrl(props.entry)}
            position="absolute"
            width="100%"
            height="100%"
          />
          {props.isExpanded ? (
            <Image
              src={getScannedUrl(props.entry)}
              position="absolute"
              width="100%"
              height="100%"
            />
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
