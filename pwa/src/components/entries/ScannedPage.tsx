import {AspectRatio, Box, Flex, Image} from "@chakra-ui/react"
import * as React from "react"
import {useEffect, useState} from "react"
import {getScannedUrl} from "../../helpers/getImageUrls"
import {ScannedEntry} from "../../types"

interface Props {
  entry: ScannedEntry
  isExpanded: boolean
}

export default function ScannedPage(props: Props) {
  const [isCached, setIsCached] = useState<boolean | null>(null)

  useEffect(() => {
    caches
      .open("media")
      .then((cache) => cache.match(getScannedUrl(props.entry)))
      .then((result) => setIsCached(!!result))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex mb={4} alignItems="center" px={props.isExpanded ? 0 : 3}>
      <AspectRatio
        ratio={props.entry.width / props.entry.height}
        w={props.isExpanded ? "100%" : "60px"}
        bg={props.entry.averageColor}
        flexShrink={0}
      >
        <Box position="relative" width="100%" height="100%">
          {props.isExpanded || isCached ? (
            <Image
              src={getScannedUrl(props.entry)}
              position="absolute"
              width="100%"
              height="100%"
              onLoad={() => setIsCached(true)}
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
