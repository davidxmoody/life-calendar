import {WarningTwoIcon} from "@chakra-ui/icons"
import {AspectRatio, Box, Flex, Image, keyframes} from "@chakra-ui/react"
import * as React from "react"
import useScannedUrl from "../../hooks/useScannedUrl"
import {ScannedEntry} from "../../types"

interface Props {
  entry: ScannedEntry
  isExpanded: boolean
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

export default function ScannedPage(props: Props) {
  const {url, error} = useScannedUrl(props.entry)

  return (
    <Flex mb={4} alignItems="center" px={props.isExpanded ? 0 : 3}>
      <AspectRatio
        ratio={props.entry.width / props.entry.height}
        w={props.isExpanded ? "100%" : "60px"}
        bg={props.entry.averageColor}
        flexShrink={0}
      >
        <Box position="relative" width="100%" height="100%">
          {url ? (
            <Image
              src={url}
              position="absolute"
              width="100%"
              height="100%"
              animation={`${fadeIn} 0.3s`}
            />
          ) : null}
          {error ? (
            <WarningTwoIcon
              color="blue.700"
              boxSize={props.isExpanded ? 12 : 4}
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
